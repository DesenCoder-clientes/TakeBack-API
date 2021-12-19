import { getRepository } from "typeorm";
import { Request, Response } from "express";
import * as bcrypt from "bcrypt";

import { Consumers } from "../../models/Consumer";
import { generateRandomNumber } from "../../utils/RandomValueGenerate";
import { sendMail } from "../../utils/SendMail";

type ConsumerRequestToConfirmData = {
  cpf: string;
  birthDate: Date;
};

type ConsumerRequestToForgotPassword = {
  code: string;
  password: string;
  newPassword: string;
};

export const confirmDataToForgotPassword = async (
  request: Request,
  response: Response
) => {
  try {
    const { cpf, birthDate }: ConsumerRequestToConfirmData = request.body;

    if (!cpf || !birthDate) {
      return response.status(401).json({ message: "Dados incompletos" });
    }

    const consumer = await getRepository(Consumers).findOne({
      select: ["id", "email", "cpf", "birthDate", "deactivedAccount"],
      where: {
        cpf,
      },
    });

    if (!consumer) {
      return response.status(404).json({ message: "CPF não cadastrado" });
    }

    if (consumer.deactivedAccount) {
      return response.status(400).json({ message: "Conta inativa" });
    }

    const aux1 = `${new Date(birthDate).getDate()}${new Date(
      birthDate
    ).getMonth()}${new Date(birthDate).getFullYear()}`;
    const aux2 = `${consumer.birthDate.getDate()}${consumer.birthDate.getMonth()}${consumer.birthDate.getFullYear()}`;

    console.log(aux1, aux2);
    if (aux1 !== aux2) {
      return response
        .status(400)
        .json({ message: "Não foi possível concluir a solicitação" });
    }

    const newCode = generateRandomNumber(1000, 9999);

    const { affected } = await getRepository(Consumers).update(consumer.id, {
      codeToConfirmEmail: JSON.stringify(newCode),
    });

    if (affected === 1) {
      const newMessage = `Seu código de verificação é ${newCode}`;

      sendMail(consumer.email, "TakeBack - Recuperação de senha", newMessage);

      return response.status(200).json({ id: consumer.id });
    }

    return response
      .status(400)
      .json({ message: "Houve um erro, tente novamente" });
  } catch (error) {
    return response.status(500).json(error);
  }
};

export const forgotPassword = async (request: Request, response: Response) => {
  try {
    const consumerID = request.params.id;
    const { newPassword, code }: ConsumerRequestToForgotPassword = request.body;

    if (!newPassword || !code) {
      return response.status(400).json({ message: "Dados não informados" });
    }

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      select: ["codeToConfirmEmail"],
    });

    if (consumer.codeToConfirmEmail !== code) {
      return response.status(400).json({ message: "Código inválido" });
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
