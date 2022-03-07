import * as bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { sendMail } from "../../../utils/SendMail";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { maskCNPJ } from "../../../utils/Masks";

interface Props {
  companyId: string;
  useCustomName?: boolean;
  customName?: string;
  useCustomFee?: boolean;
  customFee?: number;
}

class AllowCompanyFirstAccessUseCase {
  async execute(data: Props) {
    const company = await getRepository(Companies).findOne(data.companyId);

    if (!company) {
      throw new InternalError("Empresa não localizada", 404);
    }

    if (data.useCustomName && data.customName.length < 4) {
      throw new InternalError("Nome de usuário inválido", 400);
    }

    if (data.useCustomFee && !data.customFee) {
      throw new InternalError("Informe a taxa", 400);
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
      name: data.useCustomName ? data.customName : "Administrativo",
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
      customIndustryFee: data.useCustomFee ? data.customFee / 100 : 0,
      customIndustryFeeActive: data.useCustomFee,
    });

    const newMessage = `O cadastro da empresa ${
      company.fantasyName
    } foi aprovado! Para acessar o sistema utilize as seguintes credenciais.: CNPJ: "${maskCNPJ(
      company.registeredNumber
    )}", Usuário: "${
      data.customName || "Administrativo"
    }", Senha: "${newPassword}"`;

    sendMail(company.email, "TakeBack - Acesso ao sistema", newMessage);

    return "Acesso liberado";
  }
}

export { AllowCompanyFirstAccessUseCase };
