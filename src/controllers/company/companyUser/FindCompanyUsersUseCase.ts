import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";

interface Props {
  companyId: string;
}

class FindCompanyUsersUseCase {
  async execute({ companyId }: Props) {
    const users = await getRepository(CompanyUsers).find({
      where: { company: { id: companyId } },
      relations: ["companyUserTypes"],
      order: { id: "ASC" },
    });

    const userTypes = await getRepository(CompanyUserTypes).find();

    return { users, userTypes };
  }
}

export { FindCompanyUsersUseCase };
