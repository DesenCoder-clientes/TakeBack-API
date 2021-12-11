import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { CompanyPaymentMethods } from "../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../models/PaymentMethod";

interface Props {
  id: number;
}

interface findCompanyMethodsProps {
  companyId: string;
}

class FindPaymentMethodUseCase {
  async findAll() {
    const methods = await getRepository(PaymentMethods).find();

    if (methods) {
      return methods;
    }

    throw new InternalError("Nenhum método encontrado", 400);
  }

  async findOne({ id }: Props) {
    const method = await getRepository(PaymentMethods).findOne(id);

    if (method) {
      return method;
    }

    throw new InternalError("Método não encontrado", 400);
  }

  async findCompanyMethods({ companyId }: findCompanyMethodsProps) {
    if (!companyId) {
      throw new InternalError("Id da empresa não informado", 400);
    }

    const methods = await getRepository(CompanyPaymentMethods).find({
      where: { companyId },
      relations: ["paymentMethod"],
      order: { createdAt: "DESC" },
    });

    const result = [];

    methods.map((method) => {
      result.push({
        id: method.id,
        description: method.paymentMethod.description,
      });
    });

    return result;
  }
}

export { FindPaymentMethodUseCase };
