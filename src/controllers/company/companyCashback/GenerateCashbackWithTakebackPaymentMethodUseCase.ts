import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";

import { Companies } from "../../../models/Company";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";

interface Props {
  companyId: string;
  userId: string;
  cashbackData: {
    costumer: {
      cpf: string;
      value: string;
    };
    method: [
      {
        method: string;
        value: string;
      }
    ];
  };
  code: string;
}

class GenerateCashbackWithTakebackPaymentMethodUseCase {
  async execute({
    companyId,
    userId,
    cashbackData: { costumer, method },
    code,
  }: Props) {
    // Verificando se todos os dados foram informados
    if (!costumer.cpf || !costumer.value || method.length < 1) {
      throw new InternalError("Dados incompletos", 400);
    }

    // Verificando se o cliente está cadastrado e ativo
    const consumers = await getRepository(Consumers).findOne({
      where: { cpf: costumer.cpf },
    });

    if (!consumers) {
      throw new InternalError("O cliente não possui cadastro", 400);
    }

    if (consumers.deactivedAccount) {
      throw new InternalError("O cliente não está ativo", 400);
    }

    // Removendo valores nulos informados no array de métodos de pagamento
    const methodsWithoutNullItems = method.filter((item) => item !== null);

    // Verificando se foram informados métodos de pagamento duplicados
    const uniqueValue = methodsWithoutNullItems.filter(
      (elem, index, self) =>
        index === self.findIndex((item) => item.method === elem.method)
    );

    if (uniqueValue.length !== methodsWithoutNullItems.length) {
      throw new InternalError("Há itens duplicados", 400);
    }

    // Verificando se o método de pagamento TakeBack e seu códico de confirmação estão presentes
    const takebackMethod = methodsWithoutNullItems.filter(
      (item) => item.method === "1"
    );

    if (takebackMethod.length === 0) {
      throw new InternalError("Forma de pagamento não informada", 400);
    }

    if (code.length < 3) {
      throw new InternalError("Código não informado", 400);
    }

    const transactionAwait = await getRepository(TransactionStatus).findOne({
      where: { description: "Aguardando" },
    });

    const existentTransaction = await getRepository(Transactions).findOne({
      where: {
        consumers,
        keyTransaction: code,
        transactionStatus: transactionAwait,
      },
    });

    if (!existentTransaction) {
      throw new InternalError("Compra não autorizada pelo cliente2", 400);
    }

    method.map((item) => {
      if (item.method === "1") {
        if (existentTransaction.value !== parseFloat(item.value)) {
          throw new InternalError("Valor não autorizado pelo cliente", 400);
        }
      }
    });

    // Criando array com ID's dos métodos de pagamento diferentes do método TakeBack
    const methodsId = [];
    methodsWithoutNullItems.map((method) => {
      methodsId.push(parseInt(method.method));
    });

    // Buscando os métodos de pagamento a partir do array de ID's gerado
    const paymentMethods = await getRepository(CompanyPaymentMethods).find({
      where: { id: In([...methodsId]) },
      relations: ["company", "paymentMethod"],
    });

    // Calculando o valor do cashback
    let cashbackAmount = 0;
    paymentMethods.map((databaseMethod) => {
      method.map((informedMethod) => {
        if (databaseMethod.id === parseInt(informedMethod.method)) {
          cashbackAmount =
            cashbackAmount +
            databaseMethod.cashbackPercentage *
              parseFloat(informedMethod.value);
        }
      });
    });

    // Buscando a empresa e o usuário para injetar na tabela Transactions
    const companies = await getRepository(Companies).findOne(companyId);
    const companyUsers = await getRepository(CompanyUsers).findOne(userId);

    // Buscando status e tipos de transações para injetar na tabela Transactions
    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Pendente" },
      select: ["id"],
    });

    const transactionTypeUp = await getRepository(TransactionTypes).findOne({
      where: { description: "Ganho" },
      select: ["id"],
    });

    const transactionTypeDown = await getRepository(TransactionTypes).findOne({
      where: { description: "Abatimento" },
      select: ["id"],
    });

    // Calculando percentual total do cashback
    const cashbackPercent =
      (cashbackAmount * 100) / parseFloat(costumer.value) / 100;

    // Salvando as informações na tabela de Transactions
    const date = new Date();
    const balanceUpdatedUp = await getRepository(Transactions).update(
      existentTransaction.id,
      {
        companies,
        companyUsers,
        consumers,
        value: parseFloat(costumer.value),
        cashbackAmount,
        cashbackPercent: parseFloat(cashbackPercent.toFixed(3)),
        transactionTypes: transactionTypeUp,
        transactionStatus,
        dateAt: date.toLocaleDateString(),
      }
    );

    // Salvando as informações na tabela de Transactions caso não tenha o método de pagamento TakeBack
    const balanceUpdatedDown = await getRepository(Transactions).save({
      companies,
      companyUsers,
      consumers,
      value: parseFloat(costumer.value),
      cashbackAmount: existentTransaction.value,
      cashbackPercent,
      salesFee: 0,
      keyTransaction: code ? parseInt(code) : null,
      transactionType: transactionTypeDown,
      transactionStatus,
    });

    // Verificando se as informações foram salvas
    if (balanceUpdatedUp.affected !== 1) {
      throw new InternalError("Houve um erro ao emitir o cashback", 400);
    }

    // Atualizando saldo do consumidor
    const result = await getRepository(Consumers).update(consumers.id, {
      balance: consumers.balance - existentTransaction.value,
      blockedBalance: consumers.blockedBalance + cashbackAmount,
    });

    if (result.affected !== 1) {
      throw new InternalError("Houve um erro ao emitir o cashback", 400);
    }

    // Salvando cada método de pagamento e seus valores na tabela TransactionPaymentMethods
    paymentMethods.map((databaseMethod) => {
      method.map((informedMethod) => {
        if (databaseMethod.id === parseInt(informedMethod.method)) {
          if (databaseMethod.id !== 1) {
            getRepository(TransactionPaymentMethods).save({
              transaction: existentTransaction,
              transactionId: existentTransaction.id,
              paymentMethod: databaseMethod,
              paymentMethodId: databaseMethod.id,
              cashbackPercentage: databaseMethod.cashbackPercentage,
              cashbackValue:
                databaseMethod.cashbackPercentage *
                parseFloat(informedMethod.value),
            });
          } else {
            getRepository(TransactionPaymentMethods).save({
              transaction: existentTransaction,
              transactionId: existentTransaction.id,
              paymentMethod: databaseMethod,
              paymentMethodId: databaseMethod.id,
              cashbackPercentage: databaseMethod.cashbackPercentage,
              cashbackValue: parseFloat(informedMethod.value),
            });
          }
        }
      });
    });

    return "ok";
  }
}

export { GenerateCashbackWithTakebackPaymentMethodUseCase };
