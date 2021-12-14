import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";

interface Props {
  companyId: string;
  paymentId: number;
  cashbackPercentage: number;
  isActive: boolean;
}

class UpdateCompanyPaymentMethodsUseCase {
  async execute({ companyId, cashbackPercentage, isActive, paymentId }: Props) {
    if (!companyId || !cashbackPercentage || !paymentId) {
      throw new InternalError("Dados incompletos", 400);
    }

    if (cashbackPercentage < 0) {
      throw new InternalError("Percentual negativo informado", 400);
    }

    if (cashbackPercentage > 1) {
      throw new InternalError(
        "Não é possível informar valores acima de 100%",
        400
      );
    }

    const { affected } = await getRepository(CompanyPaymentMethods).update(
      paymentId,
      {
        cashbackPercentage,
        isActive,
      }
    );

    if (affected === 1) {
      return "Método de pagamento atualizado";
    }

    throw new InternalError("Houve um erro", 500);
  }
}

export { UpdateCompanyPaymentMethodsUseCase };
