import { getRepository, In } from "typeorm";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  companyId: string;
  userId: string;
}

class FindDashboardReportsUseCase {
  async execute({ companyId, userId }: Props) {
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

    // Buscando as transações do período
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transactions")
      .select("transactions.dateAt")
      .addSelect("SUM(transactions.cashbackAmount)", "sum")
      .where("transactions.companyId = :companyId", { companyId })
      .andWhere(
        "transactions.dateAt > :sevenDaysAgo AND transactions.dateAt <= :today",
        { sevenDaysAgo, today }
      )
      .andWhere(
        "transactions.transactionStatusId IN (:...transactionStatusId)",
        {
          transactionStatusId: [...transactionStatusIds],
        }
      )
      .groupBy("transactions.dateAt")
      .orderBy("transactions.dateAt", "DESC")
      .getRawMany();

    // Formatando os dados para reposta
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const result = [];
    transactions.map((item) => {
      result.push({
        nome: days[item.transactions_dateAt.getDay()],
        total: item.sum,
      });
    });

    const lastSevenDays = result.reverse();

    return { lastSevenDays };
  }
}

export { FindDashboardReportsUseCase };
