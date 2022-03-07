import { getRepository } from "typeorm";
import { PaymentMethods } from "../../../models/PaymentMethod";

class FindPaymentMethodsUseCase {
  async execute() {
    const paymentMethods = await getRepository(PaymentMethods).find();

    return paymentMethods;
  }
}

export { FindPaymentMethodsUseCase };
