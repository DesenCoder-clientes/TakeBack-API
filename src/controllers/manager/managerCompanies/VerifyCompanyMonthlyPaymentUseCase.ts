import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

class VerifyCompanyMonthlyPaymentUseCase {
  async execute() {
    // VERIFICANDO INADIMPLÊNCIA DA EMPRESA
    const today = new Date();
    const companiesBlocked = [];

    const status = await getRepository(CompanyStatus).findOne({
      where: { description: "Ativo" },
    });

    const company = await getRepository(Companies).find({
      relations: ["companyMonthlyPayment"],
      where: { status },
    });

    if (today.getDate() >= 15) {
      const bloquedStatus = await getRepository(CompanyStatus).findOne({
        where: { description: "Inadimplente por mensalidade" },
      });

      company.map(async (item) => {
        if (
          !item.currentMonthlyPaymentPaid &&
          item.companyMonthlyPayment.length > 0
        ) {
          companiesBlocked.push({
            companyId: item.id,
            fantasyName: item.fantasyName,
          });
          // Alterando o status da empresa para inadimplente
          const companyUpdated = await getRepository(Companies).update(
            item.id,
            {
              status: bloquedStatus,
            }
          );

          if (companyUpdated.affected === 0) {
            throw new InternalError("Erro ao realizar login", 400);
          }
        } else if (item.companyMonthlyPayment.length === 0) {
          // Buscando a data do primeiro acesso da empresa
          const companyAllowedDate = new Date(item.firstAccessAllowedAt);

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
              companiesBlocked.push({
                companyId: item.id,
                fantasyName: item.fantasyName,
              });
              // Alterando o status da empresa para inadimplente
              const companyUpdated = await getRepository(Companies).update(
                item.id,
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
                item.id,
                {
                  status: bloquedStatus,
                }
              );

              if (companyUpdated.affected === 0) {
                throw new InternalError("Erro ao realizar login", 400);
              }
            }
          }
        }
      });
    }

    return companiesBlocked;
  }
}

export { VerifyCompanyMonthlyPaymentUseCase };
