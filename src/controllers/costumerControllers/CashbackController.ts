import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Transactions } from "../../models/Transaction";
import { TransactionStatus } from "../../models/TransactionStatus";
import { TransactionTypes } from "../../models/TransactionType";

export const findTransactionHistoric = async (
  request: Request,
  response: Response
) => {
  try {
    const consumerID = request["tokenPayload"].id;

    const transactions = await getRepository(Transactions).find({
      where: {
        consumer: consumerID,
      },
    });

    return response.status(200).json(transactions);
  } catch (error) {
    return response.status(500).json(error);
  }
};
