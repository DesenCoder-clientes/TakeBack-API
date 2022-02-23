import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { maskCNPJ } from "../../../utils/Masks";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { sendMail } from "../../../utils/SendMail";

interface Props {
  companyId: string;
  userName: string;
  email: string;
}

class ForgotPasswordToRootUserUseCase {
  async execute({ companyId, email, userName }: Props) {
    if (!companyId || !email || !userName) {
      throw new InternalError("Dados incompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa não localizada", 404);
    }

    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { company, isRootUser: true },
    });

    if (!companyUser) {
      throw new InternalError("Usuário principal não localizado", 404);
    }

    const newPassword = generateRandomNumber(100000, 999999);
    const newPasswordEncrypted = bcrypt.hashSync(
      JSON.stringify(newPassword),
      10
    );

    const updated = await getRepository(CompanyUsers).update(companyUser.id, {
      name: userName,
      isActive: true,
      password: newPasswordEncrypted,
    });

    if (updated.affected === 0) {
      throw new InternalError("Erro ao atualizar a senha do usuário", 400);
    }

    const newMessage = `Olá ${userName}, a sua senha do TakeBack foi atualizada! Para acessar o sistema agora utilize as seguintes credenciais: CNPJ.: ${maskCNPJ(
      company.registeredNumber
    )}, Usuário.: ${userName}, Senha.: ${newPassword}`;

    sendMail(email, "TakeBack - Recuperação de senha", newMessage);

    return "Senha atualizada";
  }
}

export { ForgotPasswordToRootUserUseCase };
