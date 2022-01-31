import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";

interface Props {
  limit: string;
  offset: string;
}

class ListCompanyUseCase {
  async execute({ limit, offset }: Props) {
    const companies = await getRepository(Companies).find({
      select: [
        "id",
        "createdAt",
        "fantasyName",
        "registeredNumber",
        "monthlyPayment",
        "industry",
        "status",
      ],
      relations: ["status", "industry"],
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
    });

    return companies;
  }
}

export { ListCompanyUseCase };
