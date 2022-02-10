import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../models/Industry";

interface UpdateProps {
  description: string;
  industryFee: number;
  id: string;
}

class UpdateIndustryUseCase {
  async execute({ description, industryFee, id }: UpdateProps) {
    if (!description || !industryFee) {
      throw new InternalError("Dados incompletos", 400);
    }

    const industry = await getRepository(Industries).findOne({
      where: { id },
    });

    if (!industry) {
      throw new InternalError("Ramo não encontrado", 400);
    }

    const updateIndustry = await getRepository(Industries).update(id, {
      description,
      industryFee,
    });

    if (updateIndustry.affected !== 1) {
      throw new InternalError("Erro ao atualizar ramo", 500);
    }

    const industries = await getRepository(Industries).find({
      order: { description: "ASC" },
    });

    return {
      message: `Ramo atualizado!`,
      industries,
    };
  }
}

export { UpdateIndustryUseCase };
