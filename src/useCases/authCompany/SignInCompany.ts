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
      select: ["password"],
    });

    if (!companyUser) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    const passwordMatch = await bcrypt.compare(password, companyUser.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao realizar login", 400);
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
