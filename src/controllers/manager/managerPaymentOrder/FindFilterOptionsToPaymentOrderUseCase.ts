import { getRepository } from "typeorm";
import { PaymentMethodOfPaymentOrder } from "../../../models/PaymentMethodOfPaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

class FindFilterOptionsToPaymentOrderUseCase {
  async execute() {
    const status = await getRepository(PaymentOrderStatus).find();
    const methods = await getRepository(PaymentMethodOfPaymentOrder).find();

    return { status, methods };
  }
}

export { FindFilterOptionsToPaymentOrderUseCase };
