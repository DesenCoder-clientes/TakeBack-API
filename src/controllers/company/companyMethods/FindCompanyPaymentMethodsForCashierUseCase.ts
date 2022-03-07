import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { CompanyStatus } from "../../../models/CompanyStatus";

interface Props {
  companyId: string;
}

class FindCompanyPaymentMethodsForCashierUseCase {
  async execute({ companyId }: Props) {
    const companyIsAuthorized = await getRepository(Companies)
      .createQueryBuilder("company")
      .select("status.generateCashback")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .where("company.id = :companyId", { companyId })
      .getRawOne();

    if (!companyId) {
      throw new InternalError("Id da empresa não informado", 400);
    }

    const methodsFinded = await getRepository(CompanyPaymentMethods).find({
      where: { companyId, isActive: true },
      relations: ["paymentMethod"],
      order: { createdAt: "DESC" },
    });

    const methods = [];

    methodsFinded.map((method) => {
      methods.push({
        id: method.id,
        description: method.paymentMethod.description,
        paymentMethodId: method.paymentMethodId,
      });
    });

    return { methods, companyIsAuthorized };
  }
}

export { FindCompanyPaymentMethodsForCashierUseCase };
