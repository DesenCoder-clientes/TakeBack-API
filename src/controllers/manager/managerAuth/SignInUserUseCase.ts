import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { generateToken } from "../../../config/JWT";
import { TakeBackUsers } from "../../../models/TakeBackUsers";

interface Props {
  cpf: string;
  password: string;
}

class SignInUserUseCase {
  async execute({ cpf, password }: Props) {
    if (!cpf || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(TakeBackUsers).findOne({
      where: { cpf },
      select: ["id", "password", "name", "isActive"],
    });

    if (!user) {
      throw new InternalError("Erro ao realizar login", 401);
    }

    if (!user.isActive) {
      throw new InternalError("Não autorizado", 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao realizar login", 401);
    }

    const token = generateToken(
      {
        id: user.id,
        name: user.name,
      },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return { token, name: user.name };
  }
}

export { SignInUserUseCase };
