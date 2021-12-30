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
}

class GenerateCashbackUseCase {
  async execute({
    companyId,
    userId,
    cashbackData: { costumer, method },
  }: Props) {
    // Verificando se todos os dados foram informados
    if (!costumer.cpf || !costumer.value || method.length < 1) {
      throw new InternalError("Dados incompletos", 400);
    }

    // Verificando se o cliente está cadastrado e ativo
    const consumer = await getRepository(Consumers).findOne({
      where: { cpf: costumer.cpf },
    });

    if (!consumer) {
      throw new InternalError("O cliente não possui cadastro", 400);
    }

    if (consumer.deactivedAccount) {
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

    if (takebackMethod.length > 0) {
      throw new InternalError("Houve um erro na chamada a API", 400);
    }

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
    let cashbackPercent = 0;
    paymentMethods.map((databaseMethod) => {
      method.map((informedMethod) => {
        if (databaseMethod.id === parseInt(informedMethod.method)) {
          cashbackAmount =
            cashbackAmount +
            databaseMethod.cashbackPercentage *
              parseFloat(informedMethod.value);

          cashbackPercent = cashbackPercent + databaseMethod.cashbackPercentage;
        }
      });
    });

    // Buscando a empresa e o usuário para injetar na tabela Transactions
    const company = await getRepository(Companies).findOne(companyId);
    const companyUser = await getRepository(CompanyUsers).findOne(userId);

    // Buscando status e tipos de transações para injetar na tabela Transactions
    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Pendente" },
      select: ["id"],
    });

    const transactionType = await getRepository(TransactionTypes).findOne({
      where: { description: "Ganho" },
      select: ["id"],
    });

    // Salvando as informações na tabela de Transactions caso não tenha o método de pagamento TakeBack
    const date = new Date();
    const newCashback = await getRepository(Transactions).save({
      company,
      companyUser,
      consumer,
      value: parseFloat(costumer.value),
      cashbackAmount,
      cashbackPercent,
      salesFee: 0,
      transactionType,
      transactionStatus,
      dateAt: date.toLocaleDateString(),
    });

    // Verificando se as informações foram salvas
    if (!newCashback) {
      throw new InternalError("Houve um erro ao emitir o cashback", 400);
    }

    // Atualizando saldo do consumidor
    const { affected } = await getRepository(Consumers).update(consumer.id, {
      blockedBalance: consumer.blockedBalance + cashbackAmount,
    });

    if (affected !== 1) {
      throw new InternalError("Houve um erro ao emitir o cashback", 400);
    }

    // Salvando cada método de pagamento e seus valores na tabela TransactionPaymentMethods
    paymentMethods.map((databaseMethod) => {
      method.map((informedMethod) => {
        if (databaseMethod.id === parseInt(informedMethod.method)) {
          getRepository(TransactionPaymentMethods).save({
            transaction: newCashback,
            transactionId: newCashback.id,
            paymentMethod: databaseMethod,
            paymentMethodId: databaseMethod.id,
            cashbackPercentage: databaseMethod.cashbackPercentage,
            cashbackValue:
              databaseMethod.cashbackPercentage *
              parseFloat(informedMethod.value),
          });
        }
      });
    });

    return newCashback;
  }
}

export { GenerateCashbackUseCase };
