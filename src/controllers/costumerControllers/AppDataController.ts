import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Companies } from "../../models/Company";
import { Consumers } from "../../models/Consumer";

export const findAppData = async (request: Request, response: Response) => {
  try {
    const userData = request["tokenPayload"];

    const companies = await getRepository(Companies).find();
    const consumer = await getRepository(Consumers).findOne(userData.id, {
      relations: ["address", "address.city", "address.city.state"],
    });

    if (!consumer) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    return response.status(200).json(consumer);
  } catch (error) {
    return response.status(500).json(error);
  }
};
