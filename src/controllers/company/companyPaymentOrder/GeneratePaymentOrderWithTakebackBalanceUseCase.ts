import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Consumers } from "../../../models/Consumer";
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

class GeneratePaymentOrderWithTakebackBalanceUseCase {
  async execute({ companyId, paymentMethodId, transactionIDs }: Props) {
    if (!paymentMethodId || transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa inexistente", 404);
    }

    const processStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Aprovada" },
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

    //Variáveis para receber os valors da taxa takeback e cashback
    let takebackFeeAmount = 0;
    let cashbackAmount = 0;

    // Pegando os IDs das transações da ordem de pagamento
    const transactionsInProcess = [];
    transactionsLocalized.map(async (item) => {
      if (item.transactionStatusId === processStatus.id) {
        transactionsInProcess.push(item.transaction_id);
      }

      // Inserindo valor da taxa takeback na transação
      takebackFeeAmount =
        takebackFeeAmount + item.transaction_takebackFeeAmount;

      // Inserindo valor do cashback na transação
      cashbackAmount = cashbackAmount + item.transaction_cashbackAmount;
    });

    // Verificando se algum transação selecionada
    // para uma ordem de pagamento já está
    // em outra ordem de pagamento
    if (transactionsInProcess.length !== 0) {
      return {
        message: "Há cashbacks em processamento",
        cashbacks: transactionsInProcess,
      };
    }

    const awaitingStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Autorizada" },
    });

    // Buscando a ordem de pagamento pelo ID
    const paymentMethod = await getRepository(
      PaymentMethodOfPaymentOrder
    ).findOne(1);

    if (company.positiveBalance < takebackFeeAmount + cashbackAmount) {
      throw new InternalError("Saldo Takeback insuficiente", 400);
    }

    // Atualizando a ordem de pagamento
    const paymentOrder = await getRepository(PaymentOrder).save({
      value: takebackFeeAmount + cashbackAmount,
      company,
      status: awaitingStatus,
      paymentMethod,
    });

    // Atualizando as transações
    transactionsLocalized.map(async (item) => {
      await getRepository(Transactions).update(item.transaction_id, {
        paymentOrder,
        transactionStatus: processStatus,
      });
    });

    // Autorizando cashback para os clientes
    transactionsLocalized.map(async (item) => {
      const consumer = await getRepository(Consumers).findOne(
        item.consumers.id
      );

      await getRepository(Consumers).update(item.consumers.id, {
        blockedBalance: consumer.blockedBalance - item.cashbackAmount,
        balance: consumer.balance + item.cashbackAmount,
      });
    });

    return "sucesso";
  }
}

export { GeneratePaymentOrderWithTakebackBalanceUseCase };