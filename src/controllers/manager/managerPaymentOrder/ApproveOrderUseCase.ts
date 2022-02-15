import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface OrderProps {
  orderId: string;
}

class ApproveOrder {
  async excute({ orderId }: OrderProps) {
    // Buscando a ordem de pagamento pelo ID
    const order = await getRepository(PaymentOrder).findOne({
      where: { id: orderId },
      relations: ["transactions"],
    });

    if (!order) {
      throw new InternalError("Ordem de pagamento não encontrada", 404);
    }

    // Buscando o status 'Autorizada' para a ordem de pagamento
    const orderStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Autorizada" },
    });

    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Aprovada" },
    });

    // Atualizando o status das transações
    order.transactions.map(async (item) => {
      await getRepository(Transactions).update(item.id, {
        transactionStatus,
      });
    });

    const updateOrderStatus = await getRepository(PaymentOrder).update(
      orderId,
      {
        status: orderStatus,
      }
    );
    if (updateOrderStatus.affected === 0) {
      throw new InternalError("Erro ao atualizar ordem de pagamento", 400);
    }
  }
}

export { ApproveOrder };
