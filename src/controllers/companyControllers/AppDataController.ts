import { getRepository, TreeRepository } from "typeorm";
import { Request, Response } from "express";

import { TransactionStatus } from "../../models/TransactionStatus";
import { TransactionTypes } from "../../models/TransactionType";

export const findTransactionUtils = async (
  request: Request,
  response: Response
) => {
  try {
    const transactionStatus = await getRepository(TransactionStatus).find();
    const transactionTypes = await getRepository(TransactionTypes).find();

    return response.status(200).json({ transactionStatus, transactionTypes });
  } catch (error) {
    return response.status(200).json(error);
  }
};
