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
  status?: string;
  industry?: string;
  city?: string;
}

interface Props {
  pagination: PaginationProps;
  query: QueryProps;
}

class ListCompanyWithFilterUseCase {
  async execute({
    pagination: { limit, offset },
    query: { city, industry, status },
  }: Props) {
    const allStatus = await getRepository(CompanyStatus).find({
      select: ["id"],
    });

    const statusIds = [];
    allStatus.map((item) => {
      statusIds.push(item.id);
    });

    const industries = await getRepository(Industries).find({
      select: ["id"],
    });

    const industryIds = [];
    industries.map((item) => {
      industryIds.push(item.id);
    });

    const companies = await getRepository(Companies)
      .createQueryBuilder("co")
      .select([
        "co.id",
        "co.createdAt",
        "co.fantasyName",
        "co.registeredNumber",
        "co.email",
        "co.monthlyPayment",
      ])
      .addSelect([
        "i.id",
        "i.description",
        "cs.id",
        "cs.description",
        "ca.id",
        "ca.street",
        "ca.district",
        "ca.number",
        "ca.complement",
        "ci.name",
      ])
      .leftJoin(Industries, "i", "i.id = co.industry")
      .leftJoin(CompanyStatus, "cs", "cs.id = co.status")
      .leftJoin(CompaniesAddress, "ca", "ca.id = co.address")
      .leftJoin(City, "ci", "ci.id = ca.city")
      .where("cs.id IN (:...statusId)", {
        statusId: status ? [status] : [...statusIds],
      })
      .andWhere("i.id IN (:...industryId)", {
        industryId: industry ? [industry] : [...industryIds],
      })
      .getRawMany();

    /* const companies = await getRepository(Companies).find({
      select: [
        "id",
        "createdAt",
        "fantasyName",
        "registeredNumber",
        "email",
        "monthlyPayment",
        "industry",
        "status",
      ],
      relations: ["status", "industry"],
      order: { fantasyName: "ASC" },
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
    }); */

    return companies;
  }
}

export { ListCompanyWithFilterUseCase };