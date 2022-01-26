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
      throw new InternalError("Dados incompletos", 401);
    }

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      select: ["id", "signature", "balance"],
    });

    const passwordMatch = await bcrypt.compare(signature, consumer.signature);

    if (!passwordMatch) {
      throw new InternalError("Assinatura incorreta", 400);
    }

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: {
        description: "Aguardando",
      },
    });

    const transactionType = await getRepository(TransactionTypes).findOne({
      where: {
        description: "Abatimento",
      },
    });

    getRepository(Transactions).delete({
      transactionStatus,
    }); // Adicionar um where para deletar apenas a transação do usuário correto

    const newCode = generateRandomNumber(1000, 9999);

    const transaction = await getRepository(Transactions).save({
      value,
      keyTransaction: newCode,
      consumer,
      transactionStatus,
      transactionType,
    });

    return { code: newCode, transactionId: transaction.id };
  }
}

export { CostumerAuthorizePurchaseUseCase };
