import { getRepository, In } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";

interface Props {
  companyId: string;
}

class ReportCashbackByPaymentMethodUseCase {
  async execute({ companyId }: Props) {
    const date = new Date();
    const today = date.toLocaleDateString();
    const sevenDaysAgo = new Date(
      date.setDate(date.getDate() - 7)
    ).toLocaleDateString();

    const transactions = await getRepository(TransactionPaymentMethods)
      .createQueryBuilder("transactionPaymentMethod")
      .select("SUM(transactionPaymentMethod.cashbackValue)", "total")
      .addSelect("paymentMethods.description")
      .leftJoin(
        CompanyPaymentMethods,
        "companyPaymentMethod",
        "companyPaymentMethod.id = transactionPaymentMethod.paymentMethodId"
      )
      .leftJoin(
        Companies,
        "company",
        "company.id = companyPaymentMethod.companyId"
      )
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.id = transactionPaymentMethod.transactionId"
      )
      .leftJoin(
        PaymentMethods,
        "paymentMethods",
        "paymentMethods.id = companyPaymentMethod.paymentMethodId"
      )
      .groupBy("transactionPaymentMethod.paymentMethodId")
      .addGroupBy("companyPaymentMethod.id")
      .addGroupBy("paymentMethods.description")
      .orderBy("transactionPaymentMethod.paymentMethodId")
      .getRawMany();

    const paymentMethodName = [];
    const paymentMethodValue = [];
    transactions.map((item) => {
      paymentMethodName.push(item.paymentMethods_description);
      paymentMethodValue.push(item.total);
    });

    const data = [paymentMethodName, paymentMethodValue];

    return data;
  }
}

export { ReportCashbackByPaymentMethodUseCase };
