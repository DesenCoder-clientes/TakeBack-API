import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../models/TakeBackUsers";
import { sendMail } from "../../../utils/SendMail";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { TakeBackUserTypes } from "../../../models/TakeBackUserTypes";

interface DataProps {
  name: string;
  cpf: string;
  email: string;
  phone: string;
  userTypeId: string;
  generatePassword?: boolean;
  password?: string;
}

interface Props {
  data: DataProps;
  userId: string;
}

class RegisterUserUseCase {
  async execute({ data, userId }: Props) {
    if (
      !data.name ||
      !data.cpf ||
      !data.email ||
      !data.phone ||
      !data.userTypeId
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(TakeBackUsers).findOne({
      where: { id: userId },
      relations: ["userType"],
    });

    if (user.userType.id !== 1 && user.userType.id !== 2) {
      throw new InternalError("Não autorizado", 401);
    }

    const takeBackUser = await getRepository(TakeBackUsers).findOne({
      where: { cpf: data.cpf },
    });

    if (takeBackUser) {
      throw new InternalError("CPF já cadastrado", 302);
    }

    if (data.generatePassword === false && data.password.length < 3) {
      throw new InternalError("Senha não informada ou muito curta", 400);
    }

    const newPassword = generateRandomNumber(100000, 999999);

    const sendedPasswordEncrypted = bcrypt.hashSync(data.password || "", 10);
    const passwordGeneratedEncrypted = bcrypt.hashSync(
      newPassword.toString(),
      10
    );

    const userType = await getRepository(TakeBackUserTypes).findOne(
      parseInt(data.userTypeId)
    );

    if (!userType) {
      throw new InternalError("Tipo de usuário inexistente", 401);
    }

    const userRegistered = await getRepository(TakeBackUsers).save({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      userType: userType,
      isActive: true,
      phone: data.phone,
      password: data.generatePassword
        ? passwordGeneratedEncrypted
        : sendedPasswordEncrypted,
    });

    if (userRegistered) {
      const newMessage = `Olá ${
        userRegistered.name
      }! Seu cadastro no TakeBack foi realizado com sucesso. Para acessar o sistema utilize as seguintes credenciais.: CPF: "${
        userRegistered.cpf
      }", Senha: "${data.generatePassword ? newPassword : data.password}"`;

      sendMail(
        userRegistered.email,
        "TakeBack - Acesso ao sistema",
        newMessage
      );

      return "Usuário cadastrado com sucesso!";
    }
  }
}

export { RegisterUserUseCase };
