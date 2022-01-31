import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { generateToken } from "../../../config/JWT";
import { Consumers } from "../../../models/Consumer";

interface LoginProps {
  cpf: string;
  password: string;
}

class SignInCostumerUseCase {
  async execute({ cpf, password }: LoginProps) {
    if (!cpf || !password) {
      throw new InternalError("Dados incompletos", 400);
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
      throw new InternalError("CPF não cadastrado", 404);
    }

    if (consumer.deactivedAccount) {
      throw new InternalError("Conta inativa", 400);
    }

    const passwordMatch = await bcrypt.compare(password, consumer.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao efetuar login", 401);
    }

    const token = generateToken(
      {
        id: consumer.id,
        name: consumer.fullName,
      },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return { token, name: consumer.fullName };
  }
}

export { SignInCostumerUseCase };
