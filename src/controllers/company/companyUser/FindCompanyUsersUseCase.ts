import { getRepository } from "typeorm";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";

interface Props {
  companyId: string;
  userId: string;
}

class FindCompanyUsersUseCase {
  async execute({ companyId, userId }: Props) {
    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { id: userId },
    });

    if (companyUser.isRootUser) {
      const users = await getRepository(CompanyUsers).find({
        where: { company: { id: companyId } },
        relations: ["companyUserTypes"],
        order: { id: "ASC" },
      });

      const userTypes = await getRepository(CompanyUserTypes).find();

      return { users, userTypes };
    } else {
      const users = await getRepository(CompanyUsers).find({
        where: { company: { id: companyId }, isRootUser: false },
        relations: ["companyUserTypes"],
        order: { id: "ASC" },
      });

      const userTypes = await getRepository(CompanyUserTypes).find();

      return { users, userTypes };
    }
  }
}

export { FindCompanyUsersUseCase };
