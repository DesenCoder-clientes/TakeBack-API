import { getRepository, In } from "typeorm";
import { InternalError } from "../../config/GenerateErros";

import { Companies } from "../../models/Company";
import { CompanyPaymentMethods } from "../../models/CompanyPaymentMethod";
import { Consumers } from "../../models/Consumer";
import { Transactions } from "../../models/Transaction";
import { TransactionStatus } from "../../models/TransactionStatus";
import { TransactionTypes } from "../../models/TransactionType";

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

class GenerateCashbackUseCase {
  async generate({
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

    if (takebackMethod.length !== 0) {
      if (code.length < 4) {
        throw new InternalError("Código não informado", 400);
      }
    }

    // Filtrando apenas os métodos de pagamento diferentes do método TakeBack
    const methodsWithoutTakebackMethod = methodsWithoutNullItems.filter(
      (item) => item.method !== "1"
    );

    // Criando array com ID's dos métodos de pagamento diferentes do método TakeBack
    const methodsId = [];
    methodsWithoutTakebackMethod.map((method) => {
      methodsId.push(parseInt(method.method));
    });

    // Buscando os métodos de pagamento a partir do array de ID's gerado
    const paymentMethods = await getRepository(CompanyPaymentMethods).find({
      where: { id: In([...methodsId]) },
      relations: ["company", "paymentMethod"],
    });

    // Buscando os métodos de pagamento informados para injetar na tabela Transactions
    const companyPaymentMethods = await getRepository(
      CompanyPaymentMethods
    ).find({
      where: { id: In([...methodsId]) },
    });

    // Buscando a empresa para injetar na tabela Transactions
    const company = await getRepository(Companies).findOne(companyId);

    // const newCashback = await getRepository(Transactions).save({
    //   consumer,
    //   company,
    //   paymentMethods: companyPaymentMethods,
    //   value,
    //   cashbackAmount,
    //   salesFee,
    //   transactionStatus,
    //   transactionType,
    // })

    return "ok";
  }
}

export { GenerateCashbackUseCase };

// if (!consumerId || !value) {
//   throw new InternalError("Informações incompletas", 400);
// }

// const consumer = await getRepository(Consumers).findOne(consumerId, {
//   select: ["id", "blockedBalance"],
// });

// const company = await getRepository(Companies).findOne(companyId, {
//   select: ["id"],
// });

// const transactionStatus = await getRepository(TransactionStatus).findOne({
//   where: { description: "Pendente" },
//   select: ["id"],
// });

// const transactionType = await getRepository(TransactionTypes).findOne({
//   where: { description: "Ganho" },
//   select: ["id"],
// });

// if (!company || !transactionType || !consumer) {
//   throw new InternalError("Algo está errado", 400);
// }

// await getRepository(Consumers).update(consumerId, {
//   blockedBalance: consumer.blockedBalance + value,
// });

// const newTransaction = await getRepository(Transactions).save({
//   consumer,
//   company,
//   transactionStatus,
//   transactionType,
//   value,
//   salesFee: 5,
//   cashbackAmount: 5,
// });

// return newTransaction;
