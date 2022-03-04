import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Industries } from "../../../models/Industry";

interface PaginationProps {
  limit: string;
  offset: string;
}

interface QueryProps {
  searchTerm?: string;
}

interface Props {
  pagination: PaginationProps;
  query: QueryProps;
}

class ListCompanyWithSearchUseCase {
  async execute({
    pagination: { limit, offset },
    query: { searchTerm },
  }: Props) {
    const companies = await getRepository(Companies)
      .createQueryBuilder("company")
      .select([
        "company.id",
        "company.createdAt",
        "company.fantasyName",
        "company.corporateName",
        "company.registeredNumber",
        "company.email",
      ])
      .addSelect(["status.description", "industry.description"])
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .leftJoin(Industries, "industry", "industry.id = company.industry")
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .where("company.fantasyName ILIKE :fantasyName", {
        fantasyName: `%${searchTerm}%`,
      })
      .orWhere("company.corporateName ILIKE :corporateName", {
        corporateName: `%${searchTerm}%`,
      })
      .orWhere("company.registeredNumber ILIKE :registeredNumber", {
        registeredNumber: `%${searchTerm}%`,
      })
      .getRawMany();

    return companies;
  }
}

export { ListCompanyWithSearchUseCase };
