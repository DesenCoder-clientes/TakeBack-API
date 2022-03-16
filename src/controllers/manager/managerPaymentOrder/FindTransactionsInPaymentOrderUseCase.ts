import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  paymentOrderId: number;
}

class FindTransactionsInPaymentOrderUseCase {
  async execute({ paymentOrderId }: Props) {
    if (!paymentOrderId) {
      throw new InternalError(
        "Indentificador da ordem de pagamento não informado",
        400
      );
    }

    const transactionsInPaymentOrder = await getRepository(PaymentOrder)
      .createQueryBuilder("transactionInPaymentOrder")
      .select([
        "transaction.id",
        "transaction.totalAmount",
        "transaction.createdAt",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
      ])
      .addSelect(["consumer.fullName", "status.description"])
      .leftJoin(
        Transactions,
        "transaction",
        "transaction.paymentOrder = transactionInPaymentOrder.id"
      )
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .leftJoin(CompanyUsers, "user", "user.id = transaction.companyUsers")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )

      .orderBy("transaction.id")
      .where("transactionInPaymentOrder.id = :paymentOrderId", {
        paymentOrderId,
      })
      .getRawMany();

    return transactionsInPaymentOrder;
  }
}

export { FindTransactionsInPaymentOrderUseCase };
