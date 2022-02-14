import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentPlans } from "../../../models/PaymentPlans";

interface Props {
  planId: number;
  description: string;
  value: number;
}

class UpdatePaymentPlanUseCase {
  async execute({ description, planId, value }: Props) {
    if (!description || !value) {
      throw new InternalError("Dados incompletos", 401);
    }

    const plan = await getRepository(PaymentPlans).findOne(planId);

    if (!plan) {
      throw new InternalError("Plano não encontrado", 404);
    }

    const updatePlan = await getRepository(PaymentPlans).update(planId, {
      description,
      value,
    });

    if (updatePlan.affected === 0) {
      throw new InternalError("Erro ao atualizar o plano de pagamento", 401);
    }

    return "Plano de pagamento atualizado";
  }
}

export { UpdatePaymentPlanUseCase };
