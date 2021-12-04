import * as bcrypt from "bcrypt";
import { InternalError } from "../../config/GenerateErros";
import { getRepository } from "typeorm";
import { Companies } from "../../models/Company";
import { CompanyUsers } from "../../models/CompanyUsers";
import { CompanyUserTypes } from "../../models/CompanyUserTypes";
import { generateRandomNumber } from "../../utils/RandomValueGenerate";
import { sendMail } from "../../utils/SendMail";

interface Props {
  name?: string;
  userTypeId?: string;
  companyId: string;
  password?: string;
}

class RegisterUserUseCase {
  async execute({ companyId, name, userTypeId, password }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      return new InternalError("Empresa não localizada", 404);
    }

    if (userTypeId && name && password) {
      const companyUser = await getRepository(CompanyUsers).find({
        where: { name, company },
      });

      if (companyUser) {
        return new InternalError("Usuário já cadastrado", 400);
      }

      const userType = await getRepository(CompanyUserTypes).findOne(
        userTypeId
      );

      const passwordEncrypted = bcrypt.hashSync(password, 10);

      const newUser = await getRepository(CompanyUsers).save({
        name,
        password: passwordEncrypted,
        company,
        userType,
      });

      if (newUser) {
        return "Usuário cadastrado";
      }

      return new InternalError("Houve um erro na criação do usuário", 400);
    }

    const managerUser = await getRepository(CompanyUsers).findOne({
      where: { name: "Administrativo", company },
    });

    if (managerUser) {
      return new InternalError("Usuário administrativo já cadastrado", 400);
    }

    const userType = await getRepository(CompanyUserTypes).findOne({
      where: { description: "Administrativo" },
    });

    const newPassword = generateRandomNumber(100000, 999999);
    const newPasswordEncrypted = bcrypt.hashSync(
      JSON.stringify(newPassword),
      10
    );

    const newUser = await getRepository(CompanyUsers).save({
      name: "Administrativo",
      password: newPasswordEncrypted,
      company,
      userType,
    });

    if (newUser) {
      const newMessage = `O cadastro da empresa ${company.fantasyName} foi aprovado! Para acessar o sistema utilize as seguintes credenciais.: CNPJ: "${company.registeredNumber}", Usuário: "Administrativo", Senha: "${newPassword}"`;

      sendMail(company.email, "TakeBack - Acesso ao sistema", newMessage);
      return "Usuário administrativo criado";
    }

    return new InternalError("Erro Inexperado", 400);
  }
}

export { RegisterUserUseCase };
