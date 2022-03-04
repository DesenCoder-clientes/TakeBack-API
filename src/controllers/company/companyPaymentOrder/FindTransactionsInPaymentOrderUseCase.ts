import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";

interface Props {
  paymentOrderId: number;
  companyId: string;
}

class FindTransactionsInPaymentOrderUseCase {
  async execute({ paymentOrderId, companyId }: Props) {
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
        "transaction.value",
        "transaction.dateAt",
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
      .leftJoin(
        TransactionTypes,
        "type",
        "type.id = transaction.transactionTypes"
      )
      .where("transactionInPaymentOrder.id = :paymentOrderId", {
        paymentOrderId,
      })
      .andWhere("transactionInPaymentOrder.company = :companyId", { companyId })
      .orderBy("transaction.id")
      .getRawMany();

    return transactionsInPaymentOrder;
  }
}

export { FindTransactionsInPaymentOrderUseCase };
