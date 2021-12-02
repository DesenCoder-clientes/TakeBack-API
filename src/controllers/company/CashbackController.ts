import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Transactions } from "../../models/Transaction";
import { TransactionStatus } from "../../models/TransactionStatus";
import { TransactionTypes } from "../../models/TransactionType";
import { Consumers } from "../../models/Consumer";
import { Companies } from "../../models/Company";

type RequestTypes = {
  value: number;
  consumerID: string;
  companyID: string;
};

export const newCashback = async (request: Request, response: Response) => {
  try {
    const { consumerID, value, companyID }: RequestTypes = request.body;

    if (!consumerID || !value) {
      return response.status(400).json({ message: "Informações incompletas" });
    }

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      select: ["id", "blockedBalance"],
    });

    const company = await getRepository(Companies).findOne(companyID, {
      select: ["id"],
    });

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Pendente" },
      select: ["id"],
    });

    const transactionType = await getRepository(TransactionTypes).findOne({
      where: { description: "Ganho" },
      select: ["id"],
    });

    if (!company || !transactionType || !consumer) {
      return response.status(400).json({ message: "Algo está errado" });
    }

    await getRepository(Consumers).update(consumerID, {
      blockedBalance: consumer.blockedBalance + value,
    });

    const newTransaction = await getRepository(Transactions).save({
      consumer,
      company,
      transactionStatus,
      transactionType,
      value,
      salesFee: 5,
      cashbackAmount: 5,
    });

    return response.status(200).json(newTransaction);
  } catch (error) {
    return response.status(500).json(error);
  }
};
