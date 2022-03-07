import { getRepository, ObjectID } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Consumers } from "../../../models/Consumer";
import { PaymentOrderMethods } from "../../../models/PaymentOrderMethods";
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

    const approvedStatusTransaction = await getRepository(
      TransactionStatus
    ).findOne({
      where: { description: "Aprovada" },
    });

    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.transactionStatus",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
      ])
      .addSelect(["consumer.id"])
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .where("transaction.id IN (:...transactionIDs)", {
        transactionIDs,
      })
      .getRawMany();

    // Agrupando as transações por usuário
    const transactionsReduced = transactions.reduce(
      (previousValue, currentValue) => {
        previousValue[currentValue.consumer_id] =
          previousValue[currentValue.consumer_id] || [];
        previousValue[currentValue.consumer_id].push(currentValue);
        return previousValue;
      },
      Object.create(null)
    );

    // Alterando o formato do agrupamento para um formato compatível para mapeamento
    const transactionGroupedPerConsumer = [];
    for (const [key, values] of Object.entries(transactionsReduced)) {
      transactionGroupedPerConsumer.push({
        consumerId: key,
        transactions: values,
      });
    }

    const consumerToChangeBalance = [];
    // Somando os valores das transações e agrupando por usuário
    transactionGroupedPerConsumer.map((item) => {
      let value = 0;
      item.transactions.map((transaction) => {
        value = value + parseFloat(transaction.transaction_cashbackAmount);
      });

      consumerToChangeBalance.push({
        consumerId: item.consumerId,
        value: value,
      });
    });

    //Variáveis para receber os valors da taxa takeback e cashback
    let takebackFeeAmount = 0;
    let cashbackAmount = 0;

    // Pegando os IDs das transações da ordem de pagamento
    const transactionsInProcess = [];
    transactions.map(async (item) => {
      if (item.transactionStatusId === approvedStatusTransaction.id) {
        transactionsInProcess.push(item.transaction_id);
      }

      // Inserindo valor da taxa takeback na transação
      takebackFeeAmount =
        takebackFeeAmount + parseFloat(item.transaction_takebackFeeAmount);

      // Inserindo valor do cashback na transação
      cashbackAmount =
        cashbackAmount + parseFloat(item.transaction_cashbackAmount);
    });

    // Verificando se alguma transação selecionada
    // para uma ordem de pagamento já está
    // em outra ordem de pagamento
    if (transactionsInProcess.length !== 0) {
      return {
        message: "Há cashbacks em processamento",
        cashbacks: transactionsInProcess,
      };
    }

    const approvedStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Autorizada" },
    });

    // Buscando a ordem de pagamento pelo ID
    const paymentMethod = await getRepository(PaymentOrderMethods).findOne(1);

    if (company.positiveBalance < takebackFeeAmount + cashbackAmount) {
      throw new InternalError("Saldo Takeback insuficiente", 400);
    }

    // Atualizando a ordem de pagamento
    const paymentOrder = await getRepository(PaymentOrder).save({
      value: takebackFeeAmount + cashbackAmount,
      company,
      status: approvedStatus,
      paymentMethod,
    });

    // Atualizando as transações
    transactions.map(async (item) => {
      await getRepository(Transactions).update(item.transaction_id, {
        paymentOrder,
        transactionStatus: approvedStatusTransaction,
      });
    });

    // Autorizando cashback para os clientes
    consumerToChangeBalance.map(async (item) => {
      const consumerBalance = await getRepository(Consumers).findOne(
        item.consumerId
      );

      const balanceUpdated = await getRepository(Consumers).update(
        item.consumerId,
        {
          blockedBalance: consumerBalance.blockedBalance - item.value,
          balance: consumerBalance.balance + item.value,
        }
      );

      if (balanceUpdated.affected === 0) {
        throw new InternalError(
          "Houve um erro ao atualizar o saldo do consumidor",
          400
        );
      }
    });

    const updateBalance = await getRepository(Companies).update(companyId, {
      positiveBalance:
        company.positiveBalance - (takebackFeeAmount + cashbackAmount),
      negativeBalance:
        company.negativeBalance - (takebackFeeAmount + cashbackAmount),
    });

    if (updateBalance.affected === 0) {
      throw new InternalError(
        "Houve um erro ao atualizar o saldo da empresa",
        400
      );
    }

    return "sucesso";
  }
}

export { GeneratePaymentOrderWithTakebackBalanceUseCase };
