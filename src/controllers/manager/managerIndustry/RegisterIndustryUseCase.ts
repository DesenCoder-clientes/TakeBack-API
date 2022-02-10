import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../models/Industry";

interface Props {
  description: string;
  industryFee: number;
}

class RegisterIndustryUseCase {
  async execute({ description, industryFee }: Props) {
    if (!description || !industryFee) {
      throw new InternalError("Dados incompletos", 400);
    }

    const findIndustry = await getRepository(Industries).findOne({
      where: { description: description },
    });

    if (findIndustry) {
      throw new InternalError("Ramo já cadastrado", 302);
    }

    const registerIndustry = await getRepository(Industries).save({
      description,
      industryFee,
    });

    if (!registerIndustry) {
      throw new InternalError("Erro ao cadastrar ramo", 400);
    }

    const industries = await getRepository(Industries).find({
      order: { description: "ASC" },
    });

    return { message: "Ramo cadastrado!", industries };
  }
}

export { RegisterIndustryUseCase };
