import { getRepository } from "typeorm";
import { Request, Response } from "express";
import axios from "axios";

import { Consumers } from "../../models/Consumer";
import { ConsumerAddress } from "../../models/ConsumerAddress";
import { City } from "../../models/City";
import { State } from "../../models/State";

import { apiCorreiosResponseType } from "../../types/ApiCorreiosResponse";

type ConsumerRequestToUpdateData = {
  fullName: string;
  birthDate: Date;
};

type ConsumerRequestToUpdatePhone = {
  phone: string;
};

type ConsumerRequestToUpdateEmail = {
  email: string;
};

type ConsumerRequestToUpdateAddress = {
  street: string;
  district: string;
  number: string;
  zipCode: string;
  complement: string;
};

export const updateData = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { fullName, birthDate }: ConsumerRequestToUpdateData = request.body;

    if (!fullName || !birthDate) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      fullName,
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
      emailConfirmated: false,
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

export const updateAddress = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const {
      street,
      district,
      number,
      zipCode,
      complement,
    }: ConsumerRequestToUpdateAddress = request.body;

    console.log({
      street,
      district,
      number,
      zipCode,
      complement,
    });

    if (!street && !district && !number && !zipCode) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      relations: ["address", "address.city", "address.city.state"],
    });

    if (!consumer) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    const city = await getRepository(City).findOne({
      where: {
        zipCode,
      },
    });

    if (!city) {
      var {
        data: { localidade, uf },
      }: apiCorreiosResponseType = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`
      );

      if (!uf) {
        return response.status(404).json({ message: "Cep não localizado" });
      }

      const state = await getRepository(State).findOne({
        where: {
          initials: uf,
        },
      });

      await getRepository(City).save({
        name: localidade,
        zipCode,
        state,
        complement,
      });
    }

    const { affected } = await getRepository(ConsumerAddress).update(
      consumer.address.id,
      {
        street,
        district,
        number,
        complement,
        city,
      }
    );

    if (affected === 1) {
      const consumer = await getRepository(Consumers).findOne(consumerID, {
        relations: ["address", "address.city", "address.city.state"],
      });

      return response.status(200).json(consumer);
    }

    return response.status(400).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(500).json(error);
  }
};
