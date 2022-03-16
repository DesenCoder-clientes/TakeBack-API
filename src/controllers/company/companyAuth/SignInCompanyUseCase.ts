import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { generateToken } from "../../../config/JWT";

interface Props {
  registeredNumber: string;
  user: string;
  password: string;
}

class SignInCompanyUseCase {
  async execute({ registeredNumber, user, password }: Props) {
    // Verificando se todos os dados necessários foram informados
    if (!registeredNumber || !user || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    // Buscando a empresa
    const company = await getRepository(Companies).findOne({
      where: { registeredNumber },
      relations: ["status", "companyMonthlyPayment"],
    });

    // Verificando se a emrpesa foi localizada
    if (!company) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Verificando se a empresa está bloqueada
    if (company.status.blocked) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Buscando o usuário da empresa
    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { company, name: user },
      select: ["id", "password", "companyUserTypes", "isActive", "name"],
      relations: ["companyUserTypes"],
    });

    // Verificando se o usuário existe
    if (!companyUser) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Verificando se o usuário encontrado está ativo
    if (!companyUser.isActive) {
      throw new InternalError("Usuário não autorizado", 400);
    }

    // Verificando se a senha informada está correta
    const passwordMatch = await bcrypt.compare(password, companyUser.password);
    if (!passwordMatch) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    const token = generateToken(
      {
        companyId: company.id,
        generateCashback: company.status.generateCashback,
        userId: companyUser.id,
        isManager: companyUser.companyUserTypes.isManager,
        name: companyUser.name,
        office: companyUser.companyUserTypes.description,
      },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return {
      token,
      generateCashback: company.status.generateCashback,
      isManager: companyUser.companyUserTypes.isManager,
      name: companyUser.name,
      office: companyUser.companyUserTypes.description,
      companyId: company.id,
    };
  }
}

export { SignInCompanyUseCase };
