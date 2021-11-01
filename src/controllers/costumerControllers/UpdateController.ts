import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Consumers } from "../../models/Consumer";

type ConsumerRequest = {
  fullName: string;
  cpf: string;
  birthDate: Date;
};

export const updateConsumerData = async (
  request: Request,
  response: Response
) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { fullName, cpf, birthDate }: ConsumerRequest = request.body;

    if (!fullName || !cpf || !birthDate) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const consumer = await getRepository(Consumers).findOne(consumerID);

    if (!consumer) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      fullName,
      cpf,
      birthDate,
    });

    if (affected === 1) {
      const consumer = await getRepository(Consumers).findOne(consumerID, {
        relations: ["address", "address.city", "address.city.state"],
      });

      return response.status(200).json(consumer);
    }

    return response.status(417).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(500).json(error);
  }
};
