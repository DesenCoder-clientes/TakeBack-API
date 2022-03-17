import { getRepository, In } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  companyId: string;
}

class ReportCashbackByPaymentMethodUseCase {
  async execute({ companyId }: Props) {
    const date = new Date();
    let today = date.toLocaleDateString();
    let sevenDaysAgo = new Date(
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
    const transactions = await getRepository(TransactionPaymentMethods)
      .createQueryBuilder("transactionPaymentMethod")
      .select("SUM(transactionPaymentMethod.cashbackValue)", "total")
      .addSelect("paymentMethods.description")
      .leftJoin(
        CompanyPaymentMethods,
        "companyPaymentMethod",
        "companyPaymentMethod.id = transactionPaymentMethod.paymentMethod"
      )
      .leftJoin(
        Companies,
        "company",
        "company.id = companyPaymentMethod.company"
      )
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.id = transactionPaymentMethod.transactions"
      )
      .leftJoin(
        PaymentMethods,
        "paymentMethods",
        "paymentMethods.id = companyPaymentMethod.paymentMethod"
      )
      .where("company.id = :companyId", { companyId })
      .andWhere(
        "transaction.dateAt >= :sevenDaysAgo AND transaction.dateAt < :today",
        { sevenDaysAgo, today }
      )
      .andWhere("transaction.transactionStatus IN (:...transactionStatusId)", {
        transactionStatusId: [...transactionStatusIds],
      })
      .groupBy("transactionPaymentMethod.paymentMethod")
      .addGroupBy("companyPaymentMethod.id")
      .addGroupBy("paymentMethods.description")
      .orderBy("transactionPaymentMethod.paymentMethod")
      .getRawMany();

    // Formatando os dados para reposta
    const paymentMethodName = [];
    const paymentMethodValue = [];
    transactions.map((item) => {
      paymentMethodName.push(item.paymentMethods_description);
      paymentMethodValue.push(item.total);
    });

    const data = [paymentMethodValue, paymentMethodName];

    return data;
  }
}

export { ReportCashbackByPaymentMethodUseCase };
