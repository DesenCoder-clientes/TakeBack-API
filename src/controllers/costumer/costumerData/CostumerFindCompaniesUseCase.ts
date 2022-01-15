import { getRepository, In } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

interface FindCompaniesProps {
  limit: string;
  offset: string;
}

class CostumerFindCompaniesUseCase {
  async execute({ limit, offset }: FindCompaniesProps) {
    const status = await getRepository(CompanyStatus).find({
      where: { blocked: false },
    });

    const statusIDs = [];
    status.map((item) => {
      statusIDs.push(item.id);
    });

    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName", "createdAt"],
      where: { status: In([...statusIDs]) },
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
