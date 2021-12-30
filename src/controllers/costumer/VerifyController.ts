import { getRepository } from "typeorm";
import { Request, Response } from "express";

import { sendMail } from "../../utils/SendMail";
import { generateRandomNumber } from "../../utils/RandomValueGenerate";

import { Consumers } from "../../models/Consumer";

export const sendMailToVerify = async (
  request: Request,
  response: Response
) => {
  try {
    const consumerID = request["tokenPayload"].id;

    const consumer = await getRepository(Consumers).findOne(consumerID);

    if (!consumer) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    const newCode = generateRandomNumber(1000, 9999);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      codeToConfirmEmail: JSON.stringify(newCode),
    });

    if (affected === 1) {
      const newMessage = `Seu código de verificação é ${newCode}`;

      sendMail(consumer.email, "TakeBack - Confirmação de email", newMessage);

      return response.status(200).json({ message: "Email enviado!" });
    }

    return response
      .status(400)
      .json({ message: "Houve um erro, tente novamente" });
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const verifyEmail = async (request: Request, response: Response) => {
  try {
    const consumerID = request["tokenPayload"].id;
    const { code } = request.body;

    if (!code) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const consumer = await getRepository(Consumers).findOne(consumerID);

    if (!consumer) {
      return response.status(404).json({ message: "Usuário não encontrado" });
    }

    if (consumer.codeToConfirmEmail !== code) {
      return response
        .status(400)
        .json({ message: "Falha na validação do email" });
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      emailConfirmated: true,
    });

    if (affected === 1) {
      const consumerActually = await getRepository(Consumers).findOne(
        consumerID,
        { relations: ["address", "address.city", "address.city.state"] }
      );

      return response.status(200).json(consumerActually);
    }

    return response.status(400).json({ message: "Houve um erro" });
  } catch (error) {
    return response.status(500).json(error);
  }
};
