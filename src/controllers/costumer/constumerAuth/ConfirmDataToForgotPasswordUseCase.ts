import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { sendMail } from "../../../utils/SendMail";

interface ConfirmDataProps {
  cpf: string;
  birthDate: Date;
}

class ConfirmDataToForgotPasswordUseCase {
  async execute({ cpf, birthDate }: ConfirmDataProps) {
    if (!cpf || !birthDate) {
      throw new InternalError("Dados incompletos", 401);
    }

    const consumer = await getRepository(Consumers).findOne({
      select: ["id", "email", "cpf", "birthDate", "deactivedAccount"],
      where: {
        cpf,
      },
    });

    if (!consumer) {
      throw new InternalError("CPF não cadastrado", 404);
    }

    if (consumer.deactivedAccount) {
      throw new InternalError("Conta inativa", 400);
    }

    const aux1 = `${new Date(birthDate).getDate()}${new Date(
      birthDate
    ).getMonth()}${new Date(birthDate).getFullYear()}`;
    const aux2 = `${consumer.birthDate.getDate()}${consumer.birthDate.getMonth()}${consumer.birthDate.getFullYear()}`;

    console.log(aux1, aux2);
    if (aux1 !== aux2) {
      throw new InternalError("Não foi possível concluir a solicitação", 400);
    }

    const newCode = generateRandomNumber(1000, 9999);

    const { affected } = await getRepository(Consumers).update(consumer.id, {
      codeToConfirmEmail: JSON.stringify(newCode),
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro, tente novamente", 400);
    }
    const newMessage = `Seu código de verificação é ${newCode}`;

    sendMail(consumer.email, "TakeBack - Recuperação de senha", newMessage);

    return { id: consumer.id };
  }
}

export { ConfirmDataToForgotPasswordUseCase };
