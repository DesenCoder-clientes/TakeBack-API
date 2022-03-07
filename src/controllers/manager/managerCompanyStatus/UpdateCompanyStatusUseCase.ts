import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

interface Props {
  statusId: number;
  companyId: string;
}

class UpdadeCompanyStatusUseCase {
  async execute({ statusId, companyId }: Props) {
    const status = await getRepository(CompanyStatus).findOne(statusId);

    if (!status) {
      throw new InternalError("Status inexistente", 401);
    }

    const updateStatus = await getRepository(Companies).update(companyId, {
      status,
    });

    if (updateStatus.affected === 0) {
      throw new InternalError("Erro ao atualizar status", 500);
    }

    return "Status atualizado";
  }
}

export { UpdadeCompanyStatusUseCase };
