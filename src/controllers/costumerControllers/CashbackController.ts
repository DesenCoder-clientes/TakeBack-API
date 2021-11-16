import { getRepository, Not } from "typeorm";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

import { Transactions } from "../../models/Transaction";
import { Consumers } from "../../models/Consumer";
import { generateRandomNumber } from "../../utils/RandomValueGenerate";
import { TransactionStatus } from "../../models/TransactionStatus";
import { TransactionTypes } from "../../models/TransactionType";

type AuthorizedTransactionProps = {
  value: number;
  signature: string;
};

export const authorizePurchase = async (
  request: Request,
  response: Response
) => {
  try {
    const consumerID = request["tokenPayload"].id;

    const { value, signature }: AuthorizedTransactionProps = request.body;

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      select: ["id", "signature"],
    });

    const passwordMatch = await bcrypt.compare(signature, consumer.signature);

    if (!passwordMatch) {
      return response.status(400).json({ message: "Assinatura incorreta" });
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

    const newCode = generateRandomNumber(1000, 9999);

    const transaction = await getRepository(Transactions).save({
      value,
      keyTransaction: newCode,
      consumer,
      transactionStatus,
      transactionType,
    });

    return response
      .status(200)
      .json({ code: newCode, transactionId: transaction.id });
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const findTransactions = async (
  request: Request,
  response: Response
) => {
  try {
    const consumerID = request["tokenPayload"].id;

    const { offset, limit } = request.params;

    const transactions = await getRepository(Transactions).find({
      select: ["id", "cashbackAmount", "createdAt"],
      relations: ["company", "transactionType", "transactionStatus"],
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
      order: { createdAt: "DESC" },
      where: {
        consumer: consumerID,
        transactionStatus: {
          description: Not("Aguardando"),
        },
      },
    });

    if (transactions.length === 0) {
      return response.status(204).json({ message: "Fim da lista" });
    }

    return response.status(200).json(transactions);
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const dropTransaction = async (request: Request, response: Response) => {
  try {
    const transactionID = request.params.id;

    const transaction = await getRepository(Transactions).findOne(
      transactionID,
      {
        relations: ["transactionStatus"],
      }
    );

    if (transaction.transactionStatus.description === "Aguardando") {
      await getRepository(Transactions).delete(transactionID);

      return response.status(200).json({ message: "Operação cancelada" });
    }

    return response.status(200).json({ message: "Erro ao inutilizar código" });
  } catch (error) {
    return response.status(500).json(error);
  }
};
