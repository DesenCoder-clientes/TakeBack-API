import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { generateToken } from "../../../config/JWT";
import { CompanyMonthlyPayment } from "../../../models/CompanyMonthlyPayment";

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
      relations: ["status", "companyMonthlyPayment"],
    });

    if (!company) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    if (company.status.blocked) {
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

    // VERIFICANDO SE A EMPRESA PAGOU A MENSALIDADE CORRETAMENTE
    let isActive = false;
    const todayDate = new Date();
    const companyMonthlyPayment = await getRepository(
      CompanyMonthlyPayment
    ).findOne({
      where: { company },
    });

    const paidDate = new Date(companyMonthlyPayment.paidDate);
    const nextMounth = new Date(paidDate.getMonth() + 2);

    if (todayDate < nextMounth && todayDate.getDate() <= 10) {
      isActive = true;
    } else {
      isActive = false;
      throw new InternalError("Empresa inadimplente", 400);
    }

    // VERIFICANDO SE A EMPRESA ESTÁ INADIMPLENTE
    // Calculando o próximo dia de pagamento
    const today = new Date();
    const companyAllowedDate = new Date(company.firstAccessAllowedAt);

    const paPlus = new Date(
      companyAllowedDate.setDate(companyAllowedDate.getDate() + 30)
    );

    if (paPlus.getDate() > 10) {
      const payDate = new Date(
        `${
          companyAllowedDate.getMonth() + 2
        }/10/${companyAllowedDate.getFullYear()}`
      );

      if (today > payDate) {
        isActive = false;
        throw new InternalError("Empresa inadimplente", 400);
      } else {
        isActive = true;
      }
    } else {
      const payDate = new Date(
        `${
          companyAllowedDate.getMonth() + 1
        }/10/${companyAllowedDate.getFullYear()}`
      );

      if (today > payDate) {
        isActive = false;
        throw new InternalError("Empresa inadimplente", 400);
      } else {
        isActive = true;
      }
    }

    if (isActive) {
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
}

export { SignInCompanyUseCase };
