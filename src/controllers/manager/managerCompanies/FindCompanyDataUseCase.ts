import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Industries } from "../../../models/Industry";

interface Props {
  companyId: string;
}

class FindCompanyDataUseCase {
  async execute({ companyId }: Props) {
    const findData = await getRepository(Companies)
      .createQueryBuilder("co")
      .select([
        "co.id",
        "co.fantasyName",
        "co.corporateName",
        "co.registeredNumber",
        "co.email",
        "co.phone",
        "co.balance",
        "co.customIndustryFee",
        "co.monthlyPayment",
      ])
      .addSelect(["i.description", "i.categoryFee", "cs.description"])
      .leftJoin(Industries, "i", "i.id = co.industry")
      .leftJoin(CompanyStatus, "cs", "cs.id = co.status")
      .where("co.id = :companyId", {
        companyId,
      })
      .getOne();

    return findData;
  }
}

export { FindCompanyDataUseCase };
