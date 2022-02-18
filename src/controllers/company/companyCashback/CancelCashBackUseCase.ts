import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Consumers } from "../../../models/Consumer";
import { PaymentMethods } from "../../../models/PaymentMethod";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface CancelProps {
  transactionIDs: number[];
  cancellationDescription: string;
  companyId: string;
}

class CancelCashBackUseCase {
  async execute({
    cancellationDescription,
    transactionIDs,
    companyId,
  }: CancelProps) {
    // Verificando se os dados necessários foram informados
    if (!cancellationDescription || transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    // Buscando o status de cancelada pelo parceiro para atualizar a transação
    const status = await getRepository(TransactionStatus).findOne({
      where: { description: "Cancelada pelo parceiro" },
    });

    // Verificando se o status foi localizado
    if (!status) {
      throw new InternalError("Erro ao cancelar transação", 400);
    }

    // Buscando todas as transações informadas pelo usuário
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.takebackFeePercent",
        "transaction.takebackFeeAmount",
        "transaction.cashbackPercent",
        "transaction.cashbackAmount",
      ])
      .addSelect(["consumer.id", "paymentmethods.id"])
      .where("transaction.id IN (:...transactionIDs)", {
        transactionIDs: [...transactionIDs],
      })
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionPaymentMethods,
        "method",
        "method.id = transaction.transactionPaymentMethod"
      )
      .leftJoin(
        PaymentMethods,
        "paymentmethods",
        "paymentmethods.id = method.paymentMethod"
      )
      .getRawMany();

    return transactions;

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

    const consumersAndValuesToSubtractBlockedBalances = [];
    // Somando os valores das transações e agrupando por usuário
    transactionGroupedPerConsumer.map((item) => {
      let value = 0;
      let takebackValue = 0;
      item.transactions.map((transaction) => {
        value = value + transaction.transaction_cashbackAmount;
      });

      consumersAndValuesToSubtractBlockedBalances.push({
        consumerId: item.consumerId,
        value: value,
      });
    });

    // Percorrendo cada uma das transações localizadas
    transactions.map(async (transaction) => {
      // Atualizando o status e motivo de cancelamento da transação
      const transactionUpdated = await getRepository(Transactions).update(
        transaction.transaction_id,
        {
          transactionStatus: status,
          cancellationDescription,
        }
      );

      // Verificando se a transação foi atualizada com sucesso
      if (transactionUpdated.affected === 0) {
        throw new InternalError(
          `Erro ao cancelar a transação: ${transaction.id}`,
          400
        );
      }
    });

    // Mapeando os usuários agrupados nas transações
    consumersAndValuesToSubtractBlockedBalances.map(async (item) => {
      const blockedBalanceOfConsumer = await getRepository(Consumers).findOne(
        item.consumerId
      );

      // Atualizando o valor do salndo pendente dos usuários
      const balanceConsumerUpdated = await getRepository(Consumers).update(
        item.consumerId,
        {
          blockedBalance: blockedBalanceOfConsumer.blockedBalance - item.value,
        }
      );

      if (balanceConsumerUpdated.affected === 0) {
        throw new InternalError("Erro ao atualizar o saldo do cliente", 400);
      }
    });

    // Buscando a empresa para pegar o saldo da mesma
    const negativeBalanceOfCompany = await getRepository(Companies).findOne(
      companyId
    );

    // Somando o valor total a ser descontado do saldo negativo da empresa
    let valueToUpdateCompanyBalance = 0;
    transactions.map((item) => {
      valueToUpdateCompanyBalance =
        valueToUpdateCompanyBalance +
        item.transaction_takebackFeeAmount +
        item.transaction_cashbackAmount;
    });

    // Atualizando o saldo negativo da empresa
    const updatedCompanyNegativeBalance = await getRepository(Companies).update(
      companyId,
      {
        negativeBalance:
          negativeBalanceOfCompany.negativeBalance -
          valueToUpdateCompanyBalance,
      }
    );

    if (updatedCompanyNegativeBalance.affected === 0) {
      throw new InternalError("Erro ao atualizar o saldo da empresa", 400);
    }

    return true;
  }
}

export { CancelCashBackUseCase };
