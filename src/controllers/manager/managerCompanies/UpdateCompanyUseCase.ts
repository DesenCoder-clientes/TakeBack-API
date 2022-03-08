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
  cityId: string;
  street: string;
  number: number;
  district: string;
}

class UpdateCompanyUseCase {
  async execute(props: UpdateProps) {
    if (!props.email || !props.corporateName || !props.fantasyName) {
      throw new InternalError("Dados imcompletos", 400);
    }

    const company = await getRepository(Companies).findOne({
      where: { id: props.companyId },
    });

    if (!company) {
      throw new InternalError("Empresa não encontrada", 400);
    }

    const city = await getRepository(City).findOne({
      where: { id: props.cityId },
    });

    if (!city) {
      throw new InternalError("Cidade não encontrada", 400);
    }

    const industry = await getRepository(Industries).findOne(props.industryId);

    if (!industry) {
      throw new InternalError("Ramo de Atividade inexistente", 401);
    }

    const updateCompanyAddress = await getRepository(CompaniesAddress).update(
      props.cityId,
      {
        city,
        district: props.district,
        number: props.number,
        street: props.street,
      }
    );

    if (updateCompanyAddress.affected === 0) {
      throw new InternalError("Erro ao atualizar endereço da empresa", 500);
    }

    const updateCompany = await getRepository(Companies).update(
      props.companyId,
      {
        email: props.email,
        industry,
        registeredNumber: props.registeredNumber,
        fantasyName: props.fantasyName,
        corporateName: props.corporateName,
        phone: props.phone,
      }
    );

    if (updateCompany.affected === 0) {
      throw new InternalError("Erro ao atualizar dados da empresa", 500);
    }

    return "Empresa atualizada";
  }
}

export { UpdateCompanyUseCase };
