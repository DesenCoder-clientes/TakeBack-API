import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";

interface Props {
  limit: string;
  offset: string;
}

class ListCompanyUseCase {
  async execute({ limit, offset }: Props) {
    const findCompany = await getRepository(Companies).find({
      select: [
        "id",
        "fantasyName",
        "email",
        "registeredNumber",
        "cashbackPercentDefault",
      ],
      relations: ["status"],
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
    });

    if (findCompany.length === 0) {
      return false;
    }

    return findCompany;
  }
}

export { ListCompanyUseCase };
