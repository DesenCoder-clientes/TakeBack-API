import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  companyId: string;
}

class VerifyCashbacksExpired {
  async execute({ companyId }: Props) {
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select(["transaction.id", "transaction.createdAt"])
      .addSelect(["status.description"])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("company.id = :companyId", { companyId })
      .andWhere("status.description IN (:...status)", {
        status: ["Em atraso"],
      })
      .getRawMany();

    const today = new Date();
    const expiredTransactions = [];

    transactions.map((item) => {
      const transactionCreatedAt = new Date(item.transaction_createdAt);

      const diff = Math.abs(+today - +transactionCreatedAt);

      if (diff / (1000 * 3600 * 24) >= 10) {
        expiredTransactions.push({
          id: item.transaction_id,
        });
      }
    });

    const status = await getRepository(CompanyStatus).findOne({
      where: { description: "Inadimplente por cashbacks" },
    });

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Em atraso" },
    });

    if (expiredTransactions.length > 0) {
      expiredTransactions.map(async (item) => {
        await getRepository(Transactions).update(item.id, {
          transactionStatus,
        });
      });

      await getRepository(Companies).update(companyId, {
        status,
      });
    }

    return { expiredTransactions };
  }
}

export { VerifyCashbacksExpired };
