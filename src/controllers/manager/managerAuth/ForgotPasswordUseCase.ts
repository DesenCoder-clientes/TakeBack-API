import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../models/TakeBackUsers";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { sendMail } from "../../../utils/SendMail";

interface DataProps {
  newPassword?: string;
  generatePassword?: boolean;
}

interface Props {
  data: DataProps;
  userId: string;
  rootUserId: string;
}

class ForgotPasswordUseCase {
  async execute({ data, rootUserId, userId }: Props) {
    const rootUser = await getRepository(TakeBackUsers).findOne({
      where: { id: rootUserId },
      relations: ["userType"],
    });

    if (!rootUser.userType.isRoot) {
      throw new InternalError("Não autorizado", 401);
    }

    if (data.generatePassword === false && data.newPassword.length < 3) {
      throw new InternalError("Senha não informada ou muito curta", 400);
    }

    const userExist = await getRepository(TakeBackUsers).findOne({
      where: { id: userId },
      select: ["id", "email", "name"],
    });

    if (!userExist) {
      throw new InternalError("Usuário não localizado", 404);
    }

    const newPassword = generateRandomNumber(100000, 999999);

    const sendedPasswordEncrypted = bcrypt.hashSync(data.newPassword || "", 10);
    const passwordGeneratedEncrypted = bcrypt.hashSync(
      newPassword.toString(),
      10
    );

    const updated = await getRepository(TakeBackUsers).update(userExist.id, {
      password: data.generatePassword
        ? passwordGeneratedEncrypted
        : sendedPasswordEncrypted,
    });

    if (updated.affected === 0) {
      throw new InternalError("Erro ao atualizar senha", 400);
    }

    const newMessage = `Olá ${
      userExist.name
    }, sua senha foi atualizada pelo usuário: ${
      rootUser.name
    }. Sua nova senha: "${
      data.generatePassword ? newPassword : data.newPassword
    }"`;

    sendMail(userExist.email, "TakeBack - Alteração de senha", newMessage);

    return "Senha atualizada";
  }
}

export { ForgotPasswordUseCase };
