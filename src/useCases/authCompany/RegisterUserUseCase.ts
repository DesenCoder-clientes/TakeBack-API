import { InternalError } from "../../config/GenerateErros";
import { getRepository } from "typeorm";
import { Companies } from "../../models/Company";
import { CompanyUsers } from "../../models/CompanyUsers";
import { CompanyUserTypes } from "../../models/CompanyUserTypes";
import * as bcrypt from "bcrypt";

interface Props {
  name: string;
  type: string;
  companyId: string;
  password: string;
}

class RegisterUserUseCase {
  async execute({ companyId, name, type, password }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    const userType = await getRepository(CompanyUserTypes).findOne({
      where: {
        description: type,
      },
    });

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
}

export { RegisterUserUseCase };
