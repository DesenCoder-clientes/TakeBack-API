import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Transactions } from "../../../models/Transaction";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { PaymentOrder } from "../../../models/PaymentOrder";

interface Props {
  orderId: number;
}

class CancelPaymentOrderUseCase {
  async execute({ orderId }: Props) {
    if (!orderId) {
      throw new InternalError("Campos incompletos", 400);
    }

    const paymentOrder = await getRepository(PaymentOrder).findOne({
      where: { id: orderId },
      relations: ["transactions"],
    });

    if (!paymentOrder) {
      throw new InternalError("Erro ao encontrar ordem de pagamento", 404);
    }

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Pendente" },
    });

    if (!transactionStatus) {
      throw new InternalError("Erro ao cancelar", 400);
    }

    const orderStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Cancelada" },
    });

    if (!orderStatus) {
      throw new InternalError("Erro ao cancelar", 400);
    }

    paymentOrder.transactions.map(async (item) => {
      await getRepository(Transactions).update(item.id, {
        transactionStatus,
      });
    });

    const orderUpdated = await getRepository(PaymentOrder).update(orderId, {
      status: orderStatus,
    });

    if (orderUpdated.affected === 0) {
      throw new InternalError("Erro ao cancelar ordem de pagamento", 400);
    }

    return "Sucesso";
  }
}

export { CancelPaymentOrderUseCase };
