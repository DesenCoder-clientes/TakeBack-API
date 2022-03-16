import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

interface Props {
  companyId: string;
}

class GenerateProvisionalAccessUseCase {
  async execute({ companyId }: Props) {
    if (!companyId) {
      throw new InternalError("Informe a empresa", 400);
    }

    const company = await getRepository(Companies).findOne({
      where: { id: companyId },
      relations: ["companies"],
    });

    if (company.companies.length === 0) {
      throw new InternalError(
        "Não é permitido gerar liberação provisória para empresas que não possuem usuários",
        400
      );
    }

    const status = await getRepository(CompanyStatus).findOne({
      where: { description: "Liberação provisória" },
    });

    const updated = await getRepository(Companies).update(companyId, {
      status,
      provisionalAccessAllowedAt: new Date(),
    });

    if (updated.affected === 0) {
      throw new InternalError("Erro ao gerar liberação provisória", 400);
    }

    const expiredDate = new Date(new Date().setDate(new Date().getDate() + 3));

    return `Liberação provisória gerada - Data do vencimento: ${expiredDate.toLocaleDateString()}`;
  }
}

export { GenerateProvisionalAccessUseCase };
