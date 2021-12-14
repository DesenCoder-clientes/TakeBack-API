import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";
import * as bcrypt from "bcrypt";

interface Props {
  companyId: string;
  userTypeId: string;
  name: string;
  password: string;
}

class RegisterCompanyUsersUseCase {
  async execute({ companyId, userTypeId, name, password }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa não encontrada", 400);
    }

    const userExist = await getRepository(CompanyUsers).findOne({
      where: { name },
    });

    if (userExist) {
      throw new InternalError("Usuário já cadastrado", 400);
    }

    const userType = await getRepository(CompanyUserTypes).findOne(userTypeId);

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    const user = await getRepository(CompanyUsers).save({
      company,
      userType,
      name,
      password: passwordEncrypted,
    });

    if (!user) {
      throw new InternalError("Houve um erro na criação do usuário", 500);
    }

    return `Usuário ${name} cadastrado com sucesso`;
  }
}

export { RegisterCompanyUsersUseCase };
