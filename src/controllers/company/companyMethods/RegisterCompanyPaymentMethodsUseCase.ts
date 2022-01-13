import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";

interface Props {
  companyId: string;
  paymentId: number;
  cashbackPercentage: number;
}

class RegisterCompanyPaymentMethodsUseCase {
  async execute({ companyId, cashbackPercentage, paymentId }: Props) {
    if (
      !companyId ||
      cashbackPercentage === undefined ||
      cashbackPercentage === null ||
      !paymentId
    ) {
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

    const existentMethod = await getRepository(CompanyPaymentMethods).findOne({
      where: { paymentMethod: paymentId },
    });

    if (existentMethod) {
      throw new InternalError("Forma de pagamento já cadastrada", 400);
    }

    const company = await getRepository(Companies).findOne(companyId);

    const paymentMethod = await getRepository(PaymentMethods).findOne(
      paymentId
    );

    const newMethod = await getRepository(CompanyPaymentMethods).save({
      cashbackPercentage,
      isActive: true,
      companyId,
      company,
      paymentMethodId: paymentId,
      paymentMethod,
    });

    if (newMethod) {
      return "Método de pagamento cadastrado";
    }

    throw new InternalError("Houve um erro", 500);
  }
}

export { RegisterCompanyPaymentMethodsUseCase };
