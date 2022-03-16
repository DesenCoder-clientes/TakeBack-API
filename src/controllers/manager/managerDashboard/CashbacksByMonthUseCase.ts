import { getRepository } from "typeorm";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";

class CashbacksByMonthUseCase {
  async execute() {
    const transactions = await getRepository(TransactionPaymentMethods)
      .createQueryBuilder("paymentMethod")
      .select("SUM(paymentMethod.cashbackValue)", "billing")
      .addSelect("SUM(transaction.takebackFeeAmount)", "takebackBilling")
      .addSelect("DATE_TRUNC('month', transaction.createdAt)", "date")
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.id = paymentMethod.transactions"
      )
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .leftJoin(
        CompanyPaymentMethods,
        "companyPaymentMethod",
        "companyPaymentMethod.id = paymentMethod.paymentMethod"
      )
      .leftJoin(
        PaymentMethods,
        "method",
        "method.id = companyPaymentMethod.paymentMethod"
      )
      .where("status.description = :status", { status: "Aprovada" })
      .andWhere("method.isTakebackMethod = :isTakeback", { isTakeback: false })
      .groupBy("DATE_TRUNC('month', transaction.createdAt)")
      .getRawMany();

    const labels1 = [];
    const values1 = [];
    const labels2 = [];
    const values2 = [];

    const months = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    transactions.map((item) => {
      labels1.push(months[new Date(item.date).getMonth()]);
      values1.push(parseFloat(item.billing));

      labels2.push(months[new Date(item.date).getMonth()]);
      values2.push(parseFloat(item.takebackBilling));
    });

    const companyBilling = { labels1, values1 };
    const takebackBilling = { labels2, values2 };

    return { companyBilling, takebackBilling };
  }
}

export { CashbacksByMonthUseCase };
