import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../models/TakeBackUsers";
import { sendMail } from "../../../utils/SendMail";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { TakeBackUserTypes } from "../../../models/TakeBackUserTypes";

interface Props {
  name: string;
  cpf: string;
  email: string;
  isActive: true;
  phone: string;
  userTypeDesc: string;
}

class RegisterUserUseCase {
  async execute({ name, cpf, email, userTypeDesc, phone }: Props) {
    if (!name || !cpf || !email || !phone || !userTypeDesc) {
      throw new InternalError("Dados incompletos!", 400);
    }

    const takeBackUser = await getRepository(TakeBackUsers).findOne({
      where: { cpf },
    });

    if (takeBackUser) {
      throw new InternalError("CPF já cadastrado", 302);
    }

    const newPassword = generateRandomNumber(100000, 999999);
    const newPasswordEncrypted = bcrypt.hashSync(
      JSON.stringify(newPassword),
      10
    );

    const userType = await getRepository(TakeBackUserTypes).findOne({
      where: { description: userTypeDesc },
    });

    if (!userType) {
      throw new InternalError("Tipo de usuário inexistente", 401);
    }

    const saveTakeBackUser = await getRepository(TakeBackUsers).save({
      name,
      cpf,
      email,
      userType,
      phone,
      password: newPasswordEncrypted,
    });

    if (saveTakeBackUser) {
      const newMessage = `Usuário ${name} foi cadastrado! Para acessar o sistema utilize as seguintes credenciais.: CPF: "${cpf}", Usuário: "${name}", Senha: "${newPassword}"`;

      sendMail(email, "TakeBack - Acesso ao sistema", newMessage);
      return `Usuário ${name} cadastrado com sucesso!`;
    }
  }
}

export { RegisterUserUseCase };
