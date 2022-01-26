import * as bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { getRepository, In } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { sendMail } from "../../../utils/SendMail";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";
import { CompanyStatus } from "../../../models/CompanyStatus";

interface Props {
  name?: string;
  companyId: string;
}

class AllowCompanyFirstAccessUseCase {
  async execute({ companyId, name }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa não localizada", 404);
    }

    const managerUser = await getRepository(CompanyUsers).find({
      where: { company, isRootUser: true },
    });

    if (managerUser.length > 0) {
      throw new InternalError("Usuário administrativo já cadastrado", 400);
    }

    const companyUserTypes = await getRepository(CompanyUserTypes).findOne({
      where: { description: "Administrador" },
    });

    const newPassword = generateRandomNumber(100000, 999999);
    const newPasswordEncrypted = bcrypt.hashSync(
      JSON.stringify(newPassword),
      10
    );

    const newUser = await getRepository(CompanyUsers).save({
      name: name || "Administrativo",
      email: company.email,
      password: newPasswordEncrypted,
      company,
      companyUserTypes,
      isRootUser: true,
    });

    if (!newUser) {
      return new InternalError("Erro Inexperado", 400);
    }

    const status = await getRepository(CompanyStatus).findOne({
      where: { description: "Ativo" },
    });

    await getRepository(Companies).update(company.id, {
      status,
    });

    const newMessage = `O cadastro da empresa ${
      company.fantasyName
    } foi aprovado! Para acessar o sistema utilize as seguintes credenciais.: CNPJ: "${
      company.registeredNumber
    }", Usuário: "${name || "Administrativo"}", Senha: "${newPassword}"`;

    sendMail(company.email, "TakeBack - Acesso ao sistema", newMessage);
    return "Usuário administrativo criado";
  }
}

export { AllowCompanyFirstAccessUseCase };
