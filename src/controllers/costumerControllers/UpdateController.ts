import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { Consumers } from "../../models/Consumer";

type ConsumerRequestToUpdateData = {
  fullName: string;
  cpf: string;
  birthDate: Date;
};

type ConsumerRequestToUpdatePhone = {
  phone: string;
};

type ConsumerRequestToUpdateEmail = {
  email: string;
};

export const updateData = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { fullName, cpf, birthDate }: ConsumerRequestToUpdateData =
      request.body;

    if (!fullName || !cpf || !birthDate) {
      return response.status(400).json({ message: "Dados não informados" });
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

export const updatePhone = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { phone }: ConsumerRequestToUpdatePhone = request.body;

    if (!phone) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      phone,
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

export const updateEmail = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { email }: ConsumerRequestToUpdateEmail = request.body;

    if (!email) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      email,
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
