import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";

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
      .createQueryBuilder("co")
      .select([
        "co.id",
        "co.createdAt",
        "co.fantasyName",
        "co.corporateName",
        "co.registeredNumber",
        "co.email",
      ])
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .where("co.fantasyName ILIKE :fantasyName", {
        fantasyName: `%${searchTerm}%`,
      })
      .orWhere("co.corporateName ILIKE :corporateName", {
        corporateName: `%${searchTerm}%`,
      })
      .orWhere("co.registeredNumber ILIKE :registeredNumber", {
        registeredNumber: `%${searchTerm}%`,
      })
      .getRawMany();

    return companies;
  }
}

export { ListCompanyWithSearchUseCase };
