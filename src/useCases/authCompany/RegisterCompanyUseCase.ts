import axios from "axios";
import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { Industries } from "../../models/Industry";
import { City } from "../../models/City";
import { Companies } from "../../models/Company";
import { CompaniesAddress } from "../../models/CompanyAddress";
import { State } from "../../models/State";
import { apiCorreiosResponseType } from "../../types/ApiCorreiosResponse";

import { CompanyStatus } from "../../models/CompanyStatus";

interface Props {
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  industry: string;
  zipCode: string;
}

class RegisterCompanyUseCase {
  async execute({
    industry,
    corporateName,
    email,
    fantasyName,
    phone,
    registeredNumber,
    zipCode,
  }: Props) {
    if (
      !industry ||
      !corporateName ||
      !email ||
      !fantasyName ||
      !phone ||
      !registeredNumber ||
      !zipCode
    ) {
      throw new InternalError("Dados incompletos", 401);
    }

    const company = await getRepository(Companies).findOne({
      where: {
        registeredNumber,
      },
    });

    if (company) {
      throw new InternalError("CNPJ já cadastrado", 302);
    }

    const localizedIndustry = await getRepository(Industries).findOne(industry);

    if (!localizedIndustry) {
      throw new InternalError("Ramo de atividade não encontrado", 404);
    }

    const city = await getRepository(City).findOne({
      where: {
        zipCode,
      },
    });

    if (city) {
      var address = await getRepository(CompaniesAddress).save({
        city,
        street: "",
        district: "",
      });
    } else {
      var {
        data: { bairro, localidade, logradouro, uf },
      }: apiCorreiosResponseType = await axios.get(
        `https://viacep.com.br/ws/${zipCode}/json/`
      );

      if (!uf) {
        throw new InternalError("CEP não localizado", 404);
      }

      const state = await getRepository(State).findOne({
        where: {
          initials: uf,
        },
      });

      const newCity = await getRepository(City).save({
        name: localidade,
        zipCode,
        state,
      });

      var newAddress = await getRepository(CompaniesAddress).save({
        city: newCity,
        street: logradouro,
        district: bairro,
      });
    }

    const companyStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Bloqueado" },
    });

    const newCompany = await getRepository(Companies).save({
      corporateName,
      fantasyName,
      registeredNumber,
      email,
      phone,
      address: address ? address : newAddress,
      industry: localizedIndustry,
      status: companyStatus,
    });

    if (newCompany) {
      return "Solicitação recebida";
    }

    throw new InternalError("Houve um erro", 500);
  }
}

export { RegisterCompanyUseCase };
