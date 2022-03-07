import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Consumers } from "../../../models/Consumer";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface OrderProps {
  paymentOrderId: number;
}

class ApproveOrderAndReleaseCashbacksUseCase {
  async execute({ paymentOrderId }: OrderProps) {
    if (!paymentOrderId) {
      throw new InternalError("Ordem de pagamento não informada", 400);
    }

    // Verificando se a ordem de pagamento existe
    const paymentOrder = await getRepository(PaymentOrder).findOne({
      where: { id: paymentOrderId },
      relations: ["company"],
    });

    if (!paymentOrder) {
      throw new InternalError("Ordem de pagamento não localizada", 404);
    }

    // Encontrando transações pertencentes a ordem de pagamento
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
      .where("transaction.paymentOrder = :paymentOrderId", { paymentOrderId })
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

    // ATUALIZANDO AS TRANSAÇÕES
    // Buscando o statua de transação aprovada
    const approvedStatusTransaction = await getRepository(
      TransactionStatus
    ).findOne({
      where: { description: "Aprovada" },
    });

    // Pegando os IDs das transações da ordem de pagamento
    let transactionsUpdatedError = false;
    transactions.map(async (item) => {
      const transactionUpdated = await getRepository(Transactions).update(
        item.transaction_id,
        {
          transactionStatus: approvedStatusTransaction,
        }
      );

      if (transactionUpdated.affected === 0) {
        transactionsUpdatedError = true;
      }

      // Inserindo valor da taxa takeback na transação
      takebackFeeAmount =
        takebackFeeAmount + parseFloat(item.transaction_takebackFeeAmount);

      // Inserindo valor do cashback na transação
      cashbackAmount =
        cashbackAmount + parseFloat(item.transaction_cashbackAmount);
    });

    // VERIFICANDO SE OUVE ALGUM ERRO E VOLTANDO AO STATUS ATUAL CASO TENHA OCORRIDO
    if (transactionsUpdatedError) {
      const processingTransactionStatus = await getRepository(
        TransactionStatus
      ).findOne({
        where: { description: "Em processamento" },
      });

      transactions.map(async (item) => {
        await getRepository(Transactions).update(item.transaction_id, {
          transactionStatus: processingTransactionStatus,
        });
      });

      throw new InternalError("Erro ao atualizar transação", 400);
    }

    // ATUALIZABDO O SALDO DOS CLIENTES
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

    // ATUALIZANDO O SALDO DA EMPRESA
    // Buscando a empresa da ordem de pagamento
    const company = await getRepository(Companies).findOne({
      where: { id: paymentOrder.company.id },
    });

    // Atualizando o saldo da empresa
    const updateBalance = await getRepository(Companies).update(company.id, {
      negativeBalance:
        company.negativeBalance - (takebackFeeAmount + cashbackAmount),
    });

    if (updateBalance.affected === 0) {
      throw new InternalError(
        "Houve um erro ao atualizar o saldo da empresa",
        400
      );
    }

    // ATUALIZANDO A ORDEM DE PAGAMENTO
    // Buscando o status de ordem de pagamento autorizada
    const approvedStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Autorizada" },
    });

    // Atualizando o status da ordem de pagamento
    const paymentOrderUpdated = await getRepository(PaymentOrder).update(
      paymentOrderId,
      {
        status: approvedStatus,
      }
    );

    if (paymentOrderUpdated.affected === 0) {
      throw new InternalError("Erro ao atualizar o status da transação", 400);
    }

    return "Ordem de Pagamento aprovada!";
  }
}

export { ApproveOrderAndReleaseCashbacksUseCase };
