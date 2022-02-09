import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
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
        "company.customIndustryFee",
        "company.monthlyPayment",
      ])
      .addSelect([
        "industry.description",
        "industry.categoryFee",
        "status.description",
      ])
      .leftJoin(Industries, "industry", "industry.id = company.industry")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .where("company.id = :companyId", {
        companyId,
      })
      .getRawOne();

    return company;
  }
}

export { FindOneCompanyUseCase };
