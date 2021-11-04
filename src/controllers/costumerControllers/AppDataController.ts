import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Companies } from "../../models/Company";
import { Consumers } from "../../models/Consumer";

export const findAppData = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"];

    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName"],
      relations: ["category"],
      take: 4,
    });

    const consumer = await getRepository(Consumers).findOne(consumerID.id, {
      relations: ["address", "address.city", "address.city.state"],
    });

    if (!consumer) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    return response.status(200).json({ consumer, companies });
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const findCompanies = async (request: Request, response: Response) => {
  try {
    const skip = request.params.skip;

    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName"],
      relations: ["category"],
      take: 2,
      skip: parseInt(skip),
    });

    return response.status(200).json(companies);
  } catch (error) {
    return response.status(500).json(error);
  }
};
