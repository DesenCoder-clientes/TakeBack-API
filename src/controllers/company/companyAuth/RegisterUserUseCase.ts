import * as bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";
import { generateRandomNumber } from "../../../utils/RandomValueGenerate";
import { sendMail } from "../../../utils/SendMail";

interface Props {
  name?: string;
  userTypeId?: string;
  companyId: string;
  password?: string;
}

class RegisterUserUseCase {
  async execute({ companyId, name, userTypeId, password }: Props) {
    if (!userTypeId || !name || !password) {
      return new InternalError("Dados imcompletos", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      return new InternalError("Empresa não localizada", 404);
    }

    const companyUser = await getRepository(CompanyUsers).find({
      where: { name, company },
    });

    if (companyUser) {
      return new InternalError("Usuário já cadastrado", 400);
    }

    const userType = await getRepository(CompanyUserTypes).findOne(userTypeId);

    const passwordEncrypted = bcrypt.hashSync(password, 10);

    const newUser = await getRepository(CompanyUsers).save({
      name,
      password: passwordEncrypted,
      company,
      userType,
      isRootUser: false,
    });

    if (newUser) {
      return "Usuário cadastrado";
    }

    return new InternalError("Houve um erro na criação do usuário", 400);
  }
}

export { RegisterUserUseCase };
