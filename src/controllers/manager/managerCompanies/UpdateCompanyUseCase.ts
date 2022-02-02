import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Industries } from "../../../models/Industry";

interface UpdateProps {
  email: string;
  industryId: string;
  statusId: string;
  id: string;
  companyId: string;
}

class UpdateCompanyUseCase {
  async execute({ email, industryId, statusId, id, companyId }: UpdateProps) {
    if (!email || !industryId || !statusId) {
      throw new InternalError("Dados imcompletos", 400);
    }

    const company = await getRepository(Companies).findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Empresa não encontrada", 400);
    }

    const status = await getRepository(CompanyStatus).findOne(statusId);

    if (!status) {
      throw new InternalError("Status  inexistente", 401);
    }

    const industry = await getRepository(Industries).findOne(industryId);

    if (!industry) {
      throw new InternalError("Ramo de Atividade inexistente", 401);
    }
    console.log(companyId);

    const updateCompany = await getRepository(Companies).update(companyId, {
      email,
      industry,
      status,
    });

    if (updateCompany.affected === 0) {
      throw new InternalError("Erro ao atualizar empresa", 500);
    }

    return "Usuário atualizado";
  }
}

export { UpdateCompanyUseCase };
