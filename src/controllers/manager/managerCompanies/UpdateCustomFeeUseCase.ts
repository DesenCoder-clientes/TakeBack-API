import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";

interface Props {
  companyId: string;
  customIndustryFee: number;
  customIndustryFeeActive: boolean;
  id: string;
}

class UpdateCustomFeeUseCase {
  async execute({
    companyId,
    customIndustryFee,
    customIndustryFeeActive,
    id,
  }: Props) {
    const company = await getRepository(Companies).find({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Empresa inexistente", 401);
    }

    const update = await getRepository(Companies).update(companyId, {
      customIndustryFee,
      customIndustryFeeActive,
    });

    if (update.affected === 0) {
      throw new InternalError("Erro ao atualizar taxas", 401);
    }
    return "Taxa atualizada";
  }
}

export { UpdateCustomFeeUseCase };
