import { getRepository } from "typeorm";
import { CompanyUsers } from "../../../models/CompanyUsers";

interface Props {
  userId: string;
}

class FindAppDataUseCase {
  async execute({ userId }: Props) {
    const user = await getRepository(CompanyUsers).findOne(userId, {
      select: ["name", "companyUserTypes"],
      relations: ["companyUserTypes"],
    });

    return { name: user.name, office: user.companyUserTypes.description };
  }
}

export { FindAppDataUseCase };
