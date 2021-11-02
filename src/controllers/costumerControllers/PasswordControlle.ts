import { getRepository } from "typeorm";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

import { Consumers } from "../../models/Consumer";

type ConsumerRequestToUpdatePassword = {
  password: string;
  newPassword: string;
};

type ConsumerRequestToRegisterSignature = {
  newSignature: string;
};

export const updatePassword = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { password, newPassword }: ConsumerRequestToUpdatePassword =
      request.body;

    if (!password || !newPassword) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const consumerData = await getRepository(Consumers).findOne(consumerID, {
      select: ["password"],
    });

    const passwordMatch = await bcrypt.compare(password, consumerData.password);

    if (!passwordMatch) {
      return response.status(401).json({ message: "Senha incorreta" });
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      password: newPasswordEncrypted,
    });

    if (affected === 1) {
      return response.status(200).json({ message: "Senha alterada" });
    }

    return response.status(417).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const registerSignature = async (
  request: Request,
  response: Response
) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { newSignature }: ConsumerRequestToRegisterSignature = request.body;

    if (!newSignature || newSignature.length != 6) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const newSignatureEncrypted = bcrypt.hashSync(newSignature, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      signature: newSignatureEncrypted,
    });

    if (affected === 1) {
      return response.status(200).json({ message: "Assinatura cadastrada" });
    }

    return response.status(417).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(500).json(error);
  }
};
