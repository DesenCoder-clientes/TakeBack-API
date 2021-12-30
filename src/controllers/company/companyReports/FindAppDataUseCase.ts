import { getRepository } from "typeorm";
import { CompanyUsers } from "../../../models/CompanyUsers";

interface Props {
  userId: string;
}

class FindAppDataUseCase {
  async execute({ userId }: Props) {
    const user = await getRepository(CompanyUsers).findOne(userId, {
      select: ["name", "userType"],
      relations: ["userType"],
    });

    return { name: user.name, office: user.userType.description };
  }
}

export { FindAppDataUseCase };
