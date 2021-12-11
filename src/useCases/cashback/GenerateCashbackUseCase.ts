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
    if (!costumer.cpf || !costumer.value || method.length < 1) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumer = await getRepository(Consumers).findOne({
      where: { cpf: costumer.cpf },
    });

    if (!consumer) {
      throw new InternalError("Cliente não cadastrado", 400);
    }

    const methodsWithoutNullItems = method.filter((item) => item !== null);

    const uniqueValue = methodsWithoutNullItems.filter(
      (elem, index, self) =>
        index === self.findIndex((item) => item.method === elem.method)
    );

    if (uniqueValue.length !== methodsWithoutNullItems.length) {
      throw new InternalError("Há itens duplicados", 400);
    }

    const takebackMethod = methodsWithoutNullItems.filter(
      (item) => item.method === "1"
    );

    if (takebackMethod.length !== 0) {
      if (code.length < 4) {
        throw new InternalError("Código não informado", 400);
      }
    }

    const methodsWithoutTakebackMethod = methodsWithoutNullItems.filter(
      (item) => item.method !== "1"
    );

    const methodsId = [];
    methodsWithoutTakebackMethod.map((method) => {
      methodsId.push(parseInt(method.method));
    });

    const companyMethods = await getRepository(CompanyPaymentMethods).find({
      where: { id: In([...methodsId]) },
      relations: ["company", "paymentMethod"],
    });

    console.log(companyMethods);

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
