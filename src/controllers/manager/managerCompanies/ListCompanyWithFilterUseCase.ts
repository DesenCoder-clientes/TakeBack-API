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
    console.log("AQUI =>>>>>>>>>>>>>>>>");
    console.log(city, industry, status);
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

    const cities = await getRepository(City).find({
      select: ["id"],
    });

    const cityIds = [];
    cities.map((item) => {
      cityIds.push(item.id);
    });

    const companies = await getRepository(Companies)
      .createQueryBuilder("co")
      .select([
        "co.id",
        "co.createdAt",
        "co.fantasyName",
        "co.registeredNumber",
        "co.corporateName",
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
        "ci.id",
        "ci.name",
      ])
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .leftJoin(Industries, "i", "i.id = co.industry")
      .leftJoin(CompanyStatus, "cs", "cs.id = co.status")
      .leftJoin(CompaniesAddress, "ca", "ca.id = co.address")
      .leftJoin(City, "ci", "ci.id = ca.city")
      .where("cs.id IN (:...statusId)", {
        statusId: status ? [parseInt(status)] : [...statusIds],
      })
      .andWhere("i.id IN (:...industryId)", {
        industryId: industry ? [industry] : [...industryIds],
      })
      .andWhere("ci.id IN (:...cityId)", {
        cityId: city ? [city] : [...cityIds],
      })
      .getRawMany();

    return companies;
  }
}

export { ListCompanyWithFilterUseCase };
