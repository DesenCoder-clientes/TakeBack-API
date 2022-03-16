import { getRepository } from "typeorm";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";

class CashbacksByPaymentMethodReportUseCase {
  async execute() {
    const transactions = await getRepository(TransactionPaymentMethods)
      .createQueryBuilder("paymentMethod")
      .select("SUM(paymentMethod.cashbackValue)", "value")
      .addSelect(["method.description"])
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
      .groupBy("method.description")
      .getRawMany();

    const labels = [];
    const values = [];

    transactions.map((item) => {
      labels.push(item.method_description);
      values.push(parseFloat(item.value));
    });

    return { labels, values };
  }
}

export { CashbacksByPaymentMethodReportUseCase };
