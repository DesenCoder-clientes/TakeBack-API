import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../models/Industry";

interface UpdateProps {
  description: string;
  categoryFee: number;
  id: string;
}

class UpdateIndustryUseCase {
  async execute({ description, categoryFee, id }: UpdateProps) {
    if (!description || !categoryFee) {
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
      categoryFee,
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
