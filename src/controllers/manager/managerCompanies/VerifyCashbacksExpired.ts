import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

class VerifyCashbacksExpired {
  async execute() {
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select(["transaction.id", "transaction.createdAt"])
      .addSelect(["status.description", "company.id"])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("status.description IN (:...status)", {
        status: ["Pendente", "Em processamento"],
      })
      .getRawMany();

    const today = new Date();
    const expiredTransactions = [];

    const status = await getRepository(CompanyStatus).findOne({
      where: { description: "Inadimplente por cashbacks" },
    });

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Em atraso" },
    });

    transactions.map(async (item) => {
      const transactionCreatedAt = new Date(item.transaction_createdAt);

      const diff = Math.abs(+today - +transactionCreatedAt);

      if (diff / (1000 * 3600 * 24) >= 10) {
        expiredTransactions.push({
          id: item.transaction_id,
          companyId: item.company_id,
        });

        await getRepository(Transactions).update(item.transaction_id, {
          transactionStatus,
        });
      }
    });

    const transactionsReduced = expiredTransactions.reduce(
      (previousValue, currentValue) => {
        previousValue[currentValue.companyId] =
          previousValue[currentValue.companyId] || [];
        previousValue[currentValue.companyId].push(currentValue);
        return previousValue;
      },
      Object.create(null)
    );

    const transactionGroupedPerCompany = [];
    for (const [key, values] of Object.entries(transactionsReduced)) {
      transactionGroupedPerCompany.push({
        companyId: key,
        transactions: values,
      });
    }

    transactionGroupedPerCompany.map(async (item) => {
      await getRepository(Companies).update(item.companyId, {
        status,
      });
    });

    return { expiredTransactions };
  }
}

export { VerifyCashbacksExpired };
