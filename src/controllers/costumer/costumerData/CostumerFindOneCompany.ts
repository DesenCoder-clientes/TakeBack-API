import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";
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
        "city.name",
        "state.initials",
      ])
      .leftJoin(CompaniesAddress, "address", "company.address = address.id")
      .leftJoin(City, "city", "address.city = city.id")
      .leftJoin(State, "state", "city.state = state.id")
      .where("company.id = :companyId", {
        companyId,
      })
      .getRawOne();

    const paymentMethod = await getRepository(CompanyPaymentMethods)
      .createQueryBuilder("paymentMethod")
      .select(["paymentMethod.cashbackPercentage"])
      .addSelect(["method.description"])
      .leftJoin(Companies, "company", "company.id = :companyId", { companyId })
      .leftJoin(
        PaymentMethods,
        "method",
        "method.id = paymentMethod.paymentMethod"
      )
      .where("method.isTakebackMethod = :type", { type: false })
      .andWhere("paymentMethod.company.id = :companyId", { companyId })
      .getRawMany();

    return { company, paymentMethod };
  }
}

export { CostumerFindOneCompany };
