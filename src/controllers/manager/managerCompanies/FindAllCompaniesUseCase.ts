import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Industries } from "../../../models/Industry";

interface PaginationProps {
  limit: string;
  offset: string;
}

interface QueryProps {
  statusId?: string;
  industryId?: string;
  cityId?: string;
}

interface Props {
  pagination: PaginationProps;
  filters: QueryProps;
}

class FindAllCompaniesUseCase {
  async execute({ pagination, filters }: Props) {
    const query = getRepository(Companies)
      .createQueryBuilder("company")
      .select([
        "company.id",
        "company.registeredNumber",
        "company.fantasyName",
        "company.createdAt",
      ])
      .addSelect(["industry.description", "status.description", "city.name"])
      .leftJoin(Industries, "industry", "industry.id = company.industry")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .leftJoin(CompaniesAddress, "address", "address.id = company.address")
      .leftJoin(City, "city", "city.id = address.city")
      .limit(parseInt(pagination.limit))
      .offset(parseInt(pagination.offset) * parseInt(pagination.limit));

    if (filters.industryId) {
      query.where("industry.id = :industryId", {
        industryId: filters.industryId,
      });
    }

    if (filters.statusId) {
      query.andWhere("status.id = :statusId", { statusId: filters.statusId });
    }

    if (filters.cityId) {
      query.andWhere("city.id = :cityId", { cityId: filters.cityId });
    }

    const companies = await query.getRawMany();

    return companies;
  }
}

export { FindAllCompaniesUseCase };
