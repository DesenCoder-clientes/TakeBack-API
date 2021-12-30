import { getRepository } from "typeorm";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

import { Consumers } from "../../models/Consumer";

import { generateToken } from "../../config/JWT";

type loginTypes = {
  cpf: string;
  password: string;
  remember: boolean;
};

type ConsumerRequestToUpdatePassword = {
  password: string;
  newPassword: string;
};

type ConsumerRequestToRegisterSignature = {
  newSignature: string;
};

type ConsumerRequestToUpdateSignature = {
  signature: string;
  newSignature: string;
};

export const signIn = async (request: Request, response: Response) => {
  try {
    const { cpf, password }: loginTypes = request.body;

    if (!cpf || !password) {
      return response.status(401).json({ message: "Dados incompletos" });
    }

    const consumer = await getRepository(Consumers).findOne({
      where: {
        cpf,
      },
      select: [
        "id",
        "fullName",
        "cpf",
        "email",
        "password",
        "deactivedAccount",
      ],
    });

    if (!consumer) {
      return response.status(404).json({ message: "CPF não cadastrado" });
    }

    if (consumer.deactivedAccount) {
      return response.status(400).json({ message: "Conta inativa" });
    }

    const passwordMatch = await bcrypt.compare(password, consumer.password);

    if (!passwordMatch) {
      return response.status(401).json({ message: "Senha incorreta" });
    }

    const token = generateToken(
      { id: consumer.id },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return response.status(200).json({ ACCESS_TOKEN: token });
  } catch (error) {
    return response.status(400).json(error);
  }
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

    if (!newSignature || newSignature.length != 4) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const newSignatureEncrypted = bcrypt.hashSync(newSignature, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      signature: newSignatureEncrypted,
      signatureRegistered: true,
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

export const updateSignature = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { signature, newSignature }: ConsumerRequestToUpdateSignature =
      request.body;

    if (
      !newSignature ||
      newSignature.length != 4 ||
      !signature ||
      signature.length != 4
    ) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const consumerData = await getRepository(Consumers).findOne(consumerID, {
      select: ["signature"],
    });

    const signatureMatch = await bcrypt.compare(
      signature,
      consumerData.signature
    );

    if (!signatureMatch) {
      return response.status(401).json({ message: "Assinatura incorreta" });
    }

    const newSignatureEncrypted = bcrypt.hashSync(newSignature, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      signature: newSignatureEncrypted,
      signatureRegistered: true,
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
