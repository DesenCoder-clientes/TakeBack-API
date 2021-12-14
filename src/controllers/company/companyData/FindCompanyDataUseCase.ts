import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";

interface Props {
  companyId: string;
}

class FindCompanyDataUseCase {
  async execute({ companyId }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    return company;
  }
}

export { FindCompanyDataUseCase };
