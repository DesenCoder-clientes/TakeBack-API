import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentMethodOfPaymentOrder } from "../../../models/PaymentMethodOfPaymentOrder";

class FindaPaymentMethodUseCase {
  async execute() {
    const methods = await getRepository(PaymentMethodOfPaymentOrder)
      .createQueryBuilder("methods")
      .select(["methods.id", "methods.description"])
      .getRawMany();

    if (methods.length === 0) {
      throw new InternalError("Não há métodos cadastrados", 404);
    }

    return methods;
  }
}

export { FindaPaymentMethodUseCase };
