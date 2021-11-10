import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Companies } from "../../models/Company";
import { Consumers } from "../../models/Consumer";
import { Transactions } from "../../models/Transaction";

export const findAppData = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"];

    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName", "createdAt"],
      relations: ["category"],
      take: 20,
      order: { createdAt: "ASC" },
    });

    const consumer = await getRepository(Consumers).findOne(consumerID.id, {
      relations: ["address", "address.city", "address.city.state"],
    });

    const transactions = await getRepository(Transactions).find({
      select: ["id", "cashbackAmount", "createdAt"],
      relations: ["company", "transactionType", "transactionStatus"],
      take: 20,
      order: { createdAt: "DESC" },
    });

    if (!consumer) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    return response.status(200).json({ consumer, companies, transactions });
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const findCompanies = async (request: Request, response: Response) => {
  try {
    const { offset, limit } = request.params;

    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName", "createdAt"],
      relations: ["category"],
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
      order: { createdAt: "ASC" },
    });

    if (companies.length === 0) {
      return response.status(204).json({ message: "Fim da lista" });
    }

    return response.status(200).json(companies);
  } catch (error) {
    return response.status(500).json(error);
  }
};
