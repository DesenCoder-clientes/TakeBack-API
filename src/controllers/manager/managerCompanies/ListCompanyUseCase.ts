import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Industries } from "../../../models/Industry";

interface Props {
  limit: string;
  offset: string;
}

class ListCompanyUseCase {
  async execute({ limit, offset }: Props) {
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
        "ci.id",
        "ci.name",
        "users.name",
        "users.isRootUser",
      ])
      .leftJoin(Industries, "i", "i.id = co.industry")
      .leftJoin(CompanyStatus, "cs", "cs.id = co.status")
      .leftJoin(CompaniesAddress, "ca", "ca.id = co.address")
      .leftJoin(City, "ci", "ci.id = ca.city")
      .leftJoin(CompanyUsers, "users", "users.company = co.id")

      .getRawMany();

    return companies;
  }
}

export { ListCompanyUseCase };
