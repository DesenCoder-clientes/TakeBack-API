import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Industries } from "../../../models/Industry";

interface UpdateProps {
  fantasyName: string;
  registeredNumber: string;
  corporateName: string;
  phone: string;
  email: string;
  industryId: string;
  id: string;
  companyId: string;
  /*  cityId: string;
  street: string;
  number: number;
  district: string; */
}

class UpdateCompanyUseCase {
  async execute({
    email,
    industryId,
    companyId,
    corporateName,
    registeredNumber,
    fantasyName,
    phone,
  }: /*  district,
    cityId,
    number,
    street, */
  UpdateProps) {
    if (!email || !corporateName || !fantasyName) {
      throw new InternalError("Dados imcompletos", 400);
    }

    const company = await getRepository(Companies).findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new InternalError("Empresa não encontrada", 400);
    }

    /* const city = await getRepository(City).findOne({
      where: { id: cityId },
    });

    if (!city) {
      throw new InternalError("Cidade não encontrada", 400);
    } */

    const industry = await getRepository(Industries).findOne(industryId);

    if (!industry) {
      throw new InternalError("Ramo de Atividade inexistente", 401);
    }

    /* const updateCompanyAddress = await getRepository(CompaniesAddress).update(
      companyId,
      {
        city,
        district,
        number,
        street,
      }
    );

    if (updateCompanyAddress.affected === 0) {
      throw new InternalError("Erro ao atualizar endereço da empresa", 500);
    } */

    const updateCompany = await getRepository(Companies).update(companyId, {
      email,
      industry,
      registeredNumber,
      fantasyName,
      corporateName,
      phone,
    });

    if (updateCompany.affected === 0) {
      throw new InternalError("Erro ao atualizar dados da empresa", 500);
    }

    return "Empresa atualizada";
  }
}

export { UpdateCompanyUseCase };
