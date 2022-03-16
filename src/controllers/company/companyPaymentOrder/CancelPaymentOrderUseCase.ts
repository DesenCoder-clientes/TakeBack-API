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
    // Verificando se os dados estão completos
    if (!orderId) {
      throw new InternalError("Campos incompletos", 400);
    }

    // Buscando a ordem de pagamento e as transações relacionadas
    const paymentOrder = await getRepository(PaymentOrder).findOne({
      where: { id: orderId },
      relations: ["transactions"],
    });

    if (!paymentOrder) {
      throw new InternalError("Erro ao encontrar ordem de pagamento", 404);
    }

    // BUSCANDO OS STATUS A SEREM ATUALIZADOS
    // Status Pendente para transações pendentes
    const transactionPendingStatus = await getRepository(
      TransactionStatus
    ).findOne({
      where: { description: "Pendente" },
    });
    // Status Em atraso para transações com mais de dez dias de atraso
    const transactionExpiredStatus = await getRepository(
      TransactionStatus
    ).findOne({
      where: { description: "Em atraso" },
    });
    // Status para a ordem de pagamento
    const orderStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Cancelada" },
    });
    // Verificando se todos os status foram encontrados
    if (
      !transactionPendingStatus ||
      !transactionExpiredStatus ||
      !orderStatus
    ) {
      throw new InternalError("Erro ao cancelar", 400);
    }

    // ATUALIZANDO O STATUS DAS TRANSAÇÕES
    const today = new Date();
    paymentOrder.transactions.map(async (item) => {
      const transactionCreatedAt = new Date(item.createdAt);

      const diff = Math.abs(+today - +transactionCreatedAt);

      if (diff / (1000 * 3600 * 24) >= 10) {
        // Caso a transação tenha mais de dez dias de atraso
        await getRepository(Transactions).update(item.id, {
          transactionStatus: transactionExpiredStatus,
        });
      } else {
        // Caso a transação tenha menos de dez dias de atraso
        await getRepository(Transactions).update(item.id, {
          transactionStatus: transactionPendingStatus,
        });
      }
    });

    // Atualizando o status da ordem de pagamento
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
