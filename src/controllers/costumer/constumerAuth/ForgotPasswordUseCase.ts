import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface ForgotPasswordProps {
  newPassword: string;
  code: string;
  consumerID: string;
}

class forgotPasswordUseCase {
  async execute({ code, consumerID, newPassword }: ForgotPasswordProps) {
    if (!newPassword || !code) {
      throw new InternalError("Dados não informados", 400);
    }

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      select: ["codeToConfirmEmail"],
    });

    if (consumer.codeToConfirmEmail !== code) {
      throw new InternalError("Código inválido", 400);
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      password: newPasswordEncrypted,
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro", 417);
    }
    return "Senha alterada";
  }
}

export { forgotPasswordUseCase };
