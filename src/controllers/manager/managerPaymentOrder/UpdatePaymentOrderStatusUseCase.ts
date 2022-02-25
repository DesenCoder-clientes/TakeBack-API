import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

interface Props {
  orderId: number;
}

class UpdatePaymentOrderStatusUseCase {
  async execute({ orderId }: Props) {
    if (!orderId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const order = await getRepository(PaymentOrder).findOne({
      where: { id: orderId },
      relations: ["status"],
    });

    if (order.status.description !== "Pagamento solicitado") {
      throw new InternalError("Erro so atualizar status", 400);
    }

    const status = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Aguardando pagamento" },
    });

    const updated = await getRepository(PaymentOrder).update(orderId, {
      status,
    });

    if (updated.affected === 0) {
      throw new InternalError("Erro ao atualizar status", 400);
    }

    return "Status atualizado";
  }
}

export { UpdatePaymentOrderStatusUseCase };
