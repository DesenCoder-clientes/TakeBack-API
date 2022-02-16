import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";

interface AuthorizePurchaseProps {
  consumerID: string;
  value: number;
  signature: string;
}

class CostumerAuthorizePurchaseUseCase {
  async execute({ consumerID, value, signature }: AuthorizePurchaseProps) {
    if (!signature) {
      throw new InternalError("Dados incompletos", 400);
    }

    const consumers = await getRepository(Consumers).findOne(consumerID, {
      select: ["id", "signature", "balance"],
    });

    console.log("ID", consumerID);
    console.log("CONSUMIDOR", consumers);

    const passwordMatch = await bcrypt.compare(signature, consumers.signature);

    if (!passwordMatch) {
      throw new InternalError("Assinatura incorreta", 400);
    }

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: {
        description: "Aguardando",
      },
    });

    const transactionTypes = await getRepository(TransactionTypes).findOne({
      where: {
        description: "Abatimento",
      },
    });

    getRepository(Transactions).delete({
      transactionStatus,
    }); // Adicionar um where para deletar apenas a transação do usuário correto

    const newCode = generateRandomNumber(1000, 9999);

    const transaction = await getRepository(Transactions).save({
      consumers,
      value,
      keyTransaction: newCode,
      transactionStatus,
      transactionTypes,
    });
    return { code: newCode, transactionId: transaction.id };
  }
}

export { CostumerAuthorizePurchaseUseCase };
