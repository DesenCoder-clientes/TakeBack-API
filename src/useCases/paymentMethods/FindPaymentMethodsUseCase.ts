import { getRepository } from "typeorm";
import { InternalError } from "../../config/GenerateErros";
import { PaymentMethods } from "../../models/PaymentMethod";

interface Props {
  id: number;
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
}

export { FindPaymentMethodUseCase };
