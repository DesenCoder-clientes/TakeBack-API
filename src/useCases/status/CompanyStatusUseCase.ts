import { getRepository } from "typeorm";
import { Companies } from "../../models/Company";

interface Props {
  companyId: string;
}

class CompanyStatusUseCase {
  async toggleStatusCompany({ companyId }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    // const companyStatus = await getRepository()
  }
}
