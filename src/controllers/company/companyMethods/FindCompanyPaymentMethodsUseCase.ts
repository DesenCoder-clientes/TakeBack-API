import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";

interface Props {
  companyId: string;
}

class FindCompanyPaymentMethodsUseCase {
  async execute({ companyId }: Props) {
    if (!companyId) {
      throw new InternalError("Id da empresa não informado", 400);
    }

    const methods = await getRepository(CompanyPaymentMethods).find({
      where: { company: { id: companyId } },
      relations: ["companyPaymentMethod"],
      order: { createdAt: "DESC" },
    });

    const allMethods = await getRepository(PaymentMethods).find();

    return { methods, allMethods };
  }
}

export { FindCompanyPaymentMethodsUseCase };
