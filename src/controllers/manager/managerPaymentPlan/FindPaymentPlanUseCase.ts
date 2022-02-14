import { getRepository } from "typeorm";
import { PaymentPlans } from "../../../models/PaymentPlans";

class FindPaymentPlanUseCase {
  async execute() {
    const plans = await getRepository(PaymentPlans).find({
      order: { id: "ASC" },
    });

    return plans;
  }
}

export { FindPaymentPlanUseCase };
