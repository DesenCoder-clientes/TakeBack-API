import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";
import { Industries } from "../../../models/Industry";

interface Props {
  companyId: string;
}

class FindOneCompanyUseCase {
  async execute({ companyId }: Props) {
    const company = await getRepository(Companies)
      .createQueryBuilder("company")
      .select([
        "company.id",
        "company.fantasyName",
        "company.corporateName",
        "company.registeredNumber",
        "company.email",
        "company.phone",
        "company.balance",
        "company.monthlyPayment",
        "company.customIndustryFee",
        "company.customIndustryFeeActive",
      ])
      .addSelect([
        "industry.description",
        "status.description",
        "status.id",
        "address.street",
        "address.district",
        "address.number",
        "city.name",
      ])
      .leftJoin(Industries, "industry", "industry.id = company.industry")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .leftJoin(CompaniesAddress, "address", "address.id = company.address")
      .leftJoin(City, "city", "city.id = address.city")
      .where("company.id = :companyId", {
        companyId,
      })
      .getRawMany();

    return company;
  }
}

export { FindOneCompanyUseCase };
