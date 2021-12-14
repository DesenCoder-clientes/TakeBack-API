import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { Companies } from "../../models/Company";
import { CompanyUsers } from "../../models/CompanyUsers";
import { CompanyUserTypes } from "../../models/CompanyUserTypes";

interface Props {
  companyId: string;
}

class FindCompanyUsersUseCase {
  async find({ companyId }: Props) {
    try {
      const company = await getRepository(Companies).findOne(companyId);

      const users = await getRepository(CompanyUsers).find({
        where: { company },
        relations: ["userType"],
      });

      const userTypes = await getRepository(CompanyUserTypes).find();

      return { users, userTypes };
    } catch (error) {
      throw new InternalError("Houve um erro", 500);
    }
  }
}

export { FindCompanyUsersUseCase };
