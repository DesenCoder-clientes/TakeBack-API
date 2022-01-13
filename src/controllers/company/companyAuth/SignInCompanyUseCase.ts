import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
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
    if (!registeredNumber || !user || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const company = await getRepository(Companies).findOne({
      where: { registeredNumber },
    });

    if (!company) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { company, name: user },
      select: ["id", "password", "companyUserTypes", "isActive", "name"],
      relations: ["companyUserTypes"],
    });

    if (!companyUser) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    if (!companyUser.isActive) {
      throw new InternalError("Usuário não autorizado", 400);
    }

    const passwordMatch = await bcrypt.compare(password, companyUser.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    const token = generateToken(
      {
        companyId: company.id,
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
      isManager: companyUser.companyUserTypes.isManager,
      name: companyUser.name,
      office: companyUser.companyUserTypes.description,
    };
  }
}

export { SignInCompanyUseCase };
