import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";

interface FindCompaniesProps {
  limit: string;
  offset: string;
}

class CostumerFindCompaniesUseCase {
  async execute({ limit, offset }: FindCompaniesProps) {
    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName", "createdAt"],
      where: { status: { blocked: false } },
      relations: ["industry"],
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
      order: { createdAt: "ASC" },
    });

    if (companies.length === 0) {
      return false;
    }

    return companies;
  }
}

export { CostumerFindCompaniesUseCase };
