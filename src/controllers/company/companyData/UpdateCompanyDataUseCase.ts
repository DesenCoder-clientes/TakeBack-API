import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Industries } from "../../../models/Industry";

interface Props {
  companyId: string;
  corporateName: string;
  fantasyName: string;
  email: string;
  industry: string;
  phone: string;
}

class UpdateCompanyDataUseCase {
  async execute({
    companyId,
    corporateName,
    fantasyName,
    email,
    industry,
    phone,
  }: Props) {
    if (
      !companyId ||
      !corporateName ||
      !fantasyName ||
      !email ||
      !industry ||
      !phone
    ) {
      throw new InternalError("Dados incompletos", 400);
    }

    const companyIndustry = await getRepository(Industries).findOne(industry);

    const { affected } = await getRepository(Companies).update(companyId, {
      fantasyName,
      corporateName,
      email,
      industry: companyIndustry,
      phone,
    });

    if (affected === 1) {
      return "Dados atualizados";
    }

    throw new InternalError("Erro ao atualizar os dados", 400);
  }
}

export { UpdateCompanyDataUseCase };
