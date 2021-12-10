import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { Companies } from "../../models/Company";
import { CompanyUsers } from "../../models/CompanyUsers";
import { CompanyUserTypes } from "../../models/CompanyUserTypes";

interface Props {
  companyId: string;
  userId: string;
}

class FindDashboardDataToCompaniesUseCase {
  async find({ companyId, userId }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    const userType = await getRepository(CompanyUserTypes).findOne({
      where: { isManager: false },
    });

    const users = await getRepository(CompanyUsers).find({
      where: { company, userType },
    });

    return users;
  }
}

export { FindDashboardDataToCompaniesUseCase };
