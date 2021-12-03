import axios from "axios";
import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { Industries } from "../../models/Industry";
import { City } from "../../models/City";
import { Companies } from "../../models/Company";
import { CompaniesAddress } from "../../models/CompanyAddress";
import { State } from "../../models/State";
import { apiCorreiosResponseType } from "../../types/ApiCorreiosResponse";

interface Props {
  companyId: string;
}

class RegisterUserUseCase {
  async execute({ companyId }: Props) {
    const company = await getRepository(Companies).findOne(companyId);
  }
}

export { RegisterUserUseCase };
