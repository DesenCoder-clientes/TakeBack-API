import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalError } from "../../config/GenerateErros";
import { Companies } from "../../models/Company";
import { CompanyUsers } from "../../models/CompanyUsers";
import { generateToken } from "../../config/JWT";

interface Props {
  registeredNumber: string;
  user: string;
  password: string;
}

class SignInCompany {
  async signIn({ registeredNumber, user, password }: Props) {
    const company = await getRepository(Companies).findOne({
      where: { registeredNumber },
    });

    if (!company) {
      return new InternalError("Empresa não localizada", 404);
    }

    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { company, name: user },
      select: ["password"],
    });

    const passwordMatch = await bcrypt.compare(password, companyUser.password);

    if (!passwordMatch) {
      return new InternalError("Erro ao realizar login", 400);
    }

    const token = generateToken(
      { companyId: company.id, userId: companyUser.id },
      process.env.JWT_PRIVATE_KEY,
      parseInt(process.env.JWT_EXPIRES_IN)
    );

    return token;
  }
}

export { SignInCompany };
