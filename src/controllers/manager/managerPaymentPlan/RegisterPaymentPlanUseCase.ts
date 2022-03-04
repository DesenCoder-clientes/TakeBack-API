import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentPlans } from "../../../models/PaymentPlans";

interface Props {
  description: string;
  value: number;
}

class RegisterPaymentPlanUseCase {
  async execute({ description, value }: Props) {
    if (!description || !value) {
      throw new InternalError("Dados incompletos", 401);
    }

    const plan = await getRepository(PaymentPlans).findOne({
      where: { description },
    });

    if (plan) {
      throw new InternalError("Plano de pagamento já cadastrado", 400);
    }

    const newPlan = await getRepository(PaymentPlans).save({
      description,
      value,
    });

    if (newPlan) {
      return "Plano de pagamento cadastrado";
    }

    throw new InternalError("Houve um erro", 400);
  }
}

export { RegisterPaymentPlanUseCase };
