import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { generateToken } from "../../../config/JWT";
import { CompanyMonthlyPayment } from "../../../models/CompanyMonthlyPayment";
import { CompanyStatus } from "../../../models/CompanyStatus";

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
    const companyAux = await getRepository(Companies).findOne({
      where: { registeredNumber },
      relations: ["status", "companyMonthlyPayment"],
    });

    // Verificando se a emrpesa foi localizada
    if (!companyAux) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Verificando se a empresa está bloqueada
    if (companyAux.status.blocked) {
      throw new InternalError("Erro ao realizar login", 400);
    }

    // Buscando o usuário da empresa
    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { company: companyAux, name: user },
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

    // VERIFICANDO INADIMPLÊNCIA DA EMPRESA
    const today = new Date();

    const updatedCompany = await getRepository(Companies).findOne({
      where: { registeredNumber },
      relations: ["status", "companyMonthlyPayment"],
    });

    const bloquedStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Inadimplente" },
    });

    // Buscando os pagamentos feitos pela empresa
    const companyMonthlyPayment = await getRepository(
      CompanyMonthlyPayment
    ).find({
      where: { company: updatedCompany },
      order: { id: "DESC" },
    });

    // Verificando se a empresa está no periodo de primeiro pagamento
    if (companyMonthlyPayment.length === 0) {
      // Buscando a data do primeiro acesso da empresa
      const companyAllowedDate = new Date(updatedCompany.firstAccessAllowedAt);

      // Somando mais 30 dias a data do primeiro acesso da empresa
      const paPlus = new Date(
        companyAllowedDate.setDate(companyAllowedDate.getDate() + 30)
      );

      // Verificando se o dia atual é o dia do pagamento da empresa
      if (paPlus.getDate() > 15) {
        // Calculando a data do primeiro pagamento da empresa no mês seguinte ao atual
        const payDate = new Date(
          `${
            companyAllowedDate.getMonth() + 2
          }/15/${companyAllowedDate.getFullYear()}`
        );

        // Verificando se a data do primeiro pagamento já passou
        if (today > payDate) {
          // Alterando o status da empresa para inadimplente
          const companyUpdated = await getRepository(Companies).update(
            updatedCompany.id,
            {
              status: bloquedStatus,
            }
          );

          if (companyUpdated.affected === 0) {
            throw new InternalError("Erro ao realizar login", 400);
          }
        }
      } else {
        // Calculando a data do primeiro pagamento da empresa no mês atual
        const payDate = new Date(
          `${
            companyAllowedDate.getMonth() + 1
          }/15/${companyAllowedDate.getFullYear()}`
        );

        // Verificando se a data do primeiro pagamento já passou
        if (today > payDate) {
          // Alterando o status da empresa para inadimplente
          const companyUpdated = await getRepository(Companies).update(
            updatedCompany.id,
            {
              status: bloquedStatus,
            }
          );

          if (companyUpdated.affected === 0) {
            throw new InternalError("Erro ao realizar login", 400);
          }
        }
      }
    } // Verificando se o dia atual é o dia do pagamento
    else if (
      today.getDate() >= 15 &&
      !updatedCompany.currentMonthlyPaymentPaid
    ) {
      // Alterando o status da empresa para inadimplente
      const companyUpdated = await getRepository(Companies).update(
        updatedCompany.id,
        {
          status: bloquedStatus,
        }
      );

      if (companyUpdated.affected === 0) {
        throw new InternalError("Erro ao realizar login", 400);
      }
    }

    // Buscando a empresa
    const companyData = await getRepository(Companies).findOne({
      where: { registeredNumber },
      relations: ["status"],
    });

    const token = generateToken(
      {
        companyId: companyData.id,
        generateCashback: companyData.status.generateCashback,
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
      generateCashback: companyData.status.generateCashback,
      isManager: companyUser.companyUserTypes.isManager,
      name: companyUser.name,
      office: companyUser.companyUserTypes.description,
      companyId: companyData.id,
    };
  }
}

export { SignInCompanyUseCase };
