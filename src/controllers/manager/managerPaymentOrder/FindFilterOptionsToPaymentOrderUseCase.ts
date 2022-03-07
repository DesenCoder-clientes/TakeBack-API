import { getRepository } from "typeorm";
import { PaymentOrderMethods } from "../../../models/PaymentOrderMethods";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

class FindFilterOptionsToPaymentOrderUseCase {
  async execute() {
    const status = await getRepository(PaymentOrderStatus).find();
    const methods = await getRepository(PaymentOrderMethods).find();

    return { status, methods };
  }
}

export { FindFilterOptionsToPaymentOrderUseCase };
