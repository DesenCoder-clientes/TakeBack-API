import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentMethods } from "../../../models/PaymentMethod";

interface Props {
  id: number;
  description: string;
}

class UpdatePaymentMethodUseCase {
  async execute({ id, description }: Props) {
    const method = await getRepository(PaymentMethods).findOne({
      where: { description },
    });

    if (method) {
      throw new InternalError("Forma de pagamento já cadastrada", 400);
    }

    const newMethod = await getRepository(PaymentMethods).update(id, {
      description,
    });

    if (newMethod.affected === 0) {
      throw new InternalError("Houve um erro ao atualizar", 400);
    }

    return "Método atualizado";
  }
}

export { UpdatePaymentMethodUseCase };
