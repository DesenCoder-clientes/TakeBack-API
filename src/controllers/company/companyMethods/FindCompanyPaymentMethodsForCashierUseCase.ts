import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";

interface Props {
  companyId: string;
}

class FindCompanyPaymentMethodsForCashierUseCase {
  async execute({ companyId }: Props) {
    if (!companyId) {
      throw new InternalError("Id da empresa não informado", 400);
    }

    const methods = await getRepository(CompanyPaymentMethods).find({
      where: { companyId, isActive: true },
      relations: ["paymentMethod"],
      order: { createdAt: "DESC" },
    });

    const result = [];

    methods.map((method) => {
      result.push({
        id: method.id,
        description: method.paymentMethod.description,
        paymentMethodId: method.paymentMethodId,
      });
    });

    return result;
  }
}

export { FindCompanyPaymentMethodsForCashierUseCase };
