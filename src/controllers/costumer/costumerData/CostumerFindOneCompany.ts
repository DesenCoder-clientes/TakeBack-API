import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { State } from "../../../models/State";

interface Props {
  companyId: string;
}

class CostumerFindOneCompany {
  async execute({ companyId }: Props) {
    const company = await getRepository(Companies)
      .createQueryBuilder("company")
      .select(["company.fantasyName", "company.phone", "company.email"])
      .addSelect([
        "address.street",
        "address.district",
        "address.number",
        "paymentMethod.cashbackPercentage",
        "city.name",
        "state.initials",
      ])
      .leftJoin(CompaniesAddress, "address", "company.address = address.id")
      .leftJoin(City, "city", "address.city = city.id")
      .leftJoin(
        CompanyPaymentMethods,
        "paymentMethod",
        "company.companyPaymentMethod = paymentMethod.id"
      )
      .leftJoin(State, "state", "city.state = state.id")
      .where("paymentMethod.companyId = :companyId", {
        companyId,
      })
      .andWhere("company.id = :companyId", {
        companyId,
      })
      .getRawMany();

    return company;
  }
}

export { CostumerFindOneCompany };
