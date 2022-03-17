import { getRepository, In } from "typeorm";
import { Companies } from "../../../models/Company";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  companyId: string;
}

class CompanyBalanceUseCase {
  async execute({ companyId }: Props) {
    const date = new Date();
    const today = date.toLocaleDateString();
    const sevenDaysAgo = new Date(
      date.setDate(date.getDate() - 7)
    ).toLocaleDateString();

    // Buscando os status de transações válidos
    const transactionStatus = await getRepository(TransactionStatus).find({
      select: ["id"],
      where: {
        description: In(["Pendente", "Aprovada"]),
      },
    });

    // Criando array com os IDs dos tipos de transações válidas
    const transactionStatusIds = [];
    transactionStatus.map((item) => {
      transactionStatusIds.push(item.id);
    });

    // Buscando as transações realizadas no período
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transactions")
      .select("SUM(transactions.totalAmount)", "total")
      .where("transactions.companies = :companyId", { companyId })
      .andWhere(
        "transactions.dateAt >= :sevenDaysAgo AND transactions.dateAt < :today",
        { sevenDaysAgo, today }
      )
      .andWhere("transactions.transactionStatus IN (:...transactionStatusId)", {
        transactionStatusId: [...transactionStatusIds],
      })
      .getRawMany();

    const company = await getRepository(Companies).findOne(companyId);

    const totalBilling = transactions[0].total;
    const balance = company.positiveBalance;

    return { totalBilling, balance };
  }
}

export { CompanyBalanceUseCase };
