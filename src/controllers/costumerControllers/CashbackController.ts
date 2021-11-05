import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Transactions } from "../../models/Transaction";

export const findTransactions = async (
  request: Request,
  response: Response
) => {
  try {
    const consumerID = request["tokenPayload"].id;

    const skip = request.params.skip;

    const transactions = await getRepository(Transactions).find({
      select: ["id", "cashbackAmount", "createdAt"],
      relations: ["company", "transactionType", "transactionStatus"],
      take: 20,
      skip: parseInt(skip),
      order: {
        createdAt: "DESC",
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
