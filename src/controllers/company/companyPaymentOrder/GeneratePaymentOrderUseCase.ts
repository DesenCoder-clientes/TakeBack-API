import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { PaymentMethodOfPaymentOrder } from "../../../models/PaymentMethodOfPaymentOrder";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  transactionIDs: number[];
  companyId: string;
  paymentMethodId: number;
}

class GeneratePaymentOrderUseCase {
  async execute({ transactionIDs, companyId, paymentMethodId }: Props) {
    if (!paymentMethodId || transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa inexistente", 404);
    }

    const processStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Em processamento" },
    });

    const transactionsLocalized = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.transactionStatus",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
      ])
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("transaction.id IN (:...transactionIDs)", {
        transactionIDs,
      })
      .getRawMany();

    let takebackFeeAmount = 0;
    let cashbackAmount = 0;

    const transactionsInProcess = [];
    transactionsLocalized.map((item) => {
      if (item.transactionStatusId === processStatus.id) {
        transactionsInProcess.push(item.transaction_id);
      }

      takebackFeeAmount =
        takebackFeeAmount + item.transaction_takebackFeeAmount;

      cashbackAmount = cashbackAmount + item.transaction_cashbackAmount;
    });

    if (transactionsInProcess.length !== 0) {
      return {
        message: "Há cashbacks em processamento",
        cashbacks: transactionsInProcess,
      };
    }

    const awaitingStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Aguardando" },
    });

    const paymentMethod = await getRepository(
      PaymentMethodOfPaymentOrder
    ).findOne({
      where: { id: paymentMethodId },
    });

    const paymentOrder = await getRepository(PaymentOrder).save({
      value: takebackFeeAmount + cashbackAmount,
      company,
      status: awaitingStatus,
      paymentMethod,
    });

    transactionsLocalized.map(async (item) => {
      await getRepository(Transactions).update(item.transaction_id, {
        paymentOrder,
        transactionStatus: processStatus,
      });
    });

    return "sucesso";
  }
}

export { GeneratePaymentOrderUseCase };
