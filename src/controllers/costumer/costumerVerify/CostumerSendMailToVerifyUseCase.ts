import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { sendMail } from "../../../utils/SendMail";

interface MailToVerifyProps {
  consumerID: string;
}

class CostumerSendMailToVerifyUseCase {
  async execute({ consumerID }: MailToVerifyProps) {
    const consumer = await getRepository(Consumers).findOne(consumerID);

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    const newCode = generateRandomNumber(1000, 9999);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      codeToConfirmEmail: JSON.stringify(newCode),
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro, tente novamente", 400);
    }
    const newMessage = `Seu código de verificação é ${newCode}`;

    sendMail(consumer.email, "TakeBack - Confirmação de email", newMessage);

    return "Email enviado!";
  }
}

export { CostumerSendMailToVerifyUseCase };
