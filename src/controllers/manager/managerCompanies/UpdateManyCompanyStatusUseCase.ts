import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

interface Props {
  statusId: number;
  companyIds: Array<string>;
}

class UpdateManyCompanyStatusUseCase {
  async execute({ statusId, companyIds }: Props) {
    if (!statusId || companyIds.length === 0) {
      throw new InternalError("Informe o status e as empresas", 400);
    }

    const status = await getRepository(CompanyStatus).findOne(statusId);
    const companies = await getRepository(Companies).find({
      where: { id: In([...companyIds]) },
      relations: ["status"],
    });

    companies.map((item) => {
      if (
        status.description === "Ativo" &&
        item.status.description === "Cadastro solicitado"
      ) {
        throw new InternalError(
          "Não é permitido ativar empresas com status 'Cadastro solicitado'",
          400
        );
      }
    });

    companies.map(async (item) => {
      const companyUpdated = await getRepository(Companies).update(item.id, {
        status,
      });

      if (companyUpdated.affected === 0) {
        throw new InternalError(
          `Erro ao atualizar o status da empresa ${item.fantasyName}`,
          400
        );
      }
    });

    return "Status atualizado";
  }
}

export { UpdateManyCompanyStatusUseCase };
