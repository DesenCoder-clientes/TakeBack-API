import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Consumers } from "../../../models/Consumer";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { CompaniesController } from "../managerCompanies/CompaniesController";

interface OrderProps {
  orderId: number;
}

class ApproveOrderUseCase {
  async excute({ orderId }: OrderProps) {
    // Encontrando transações pertencentes a ordem de pagamento
    const findTransactions = await getRepository(Transactions).find({
      where: { paymentOrder: orderId },
      relations: ["consumers"],
    });

    // Pegando status "Aprovada" para alterar o status da transação
    const transactionStatus = await getRepository(TransactionStatus).findOne({
      where: { description: "Aprovada" },
    });

    findTransactions.map(async (item) => {
      await getRepository(Transactions).update(item.id, {
        transactionStatus,
      });

      const consumer = await getRepository(Consumers).findOne(
        item.consumers.id
      );

      await getRepository(Consumers).update(item.consumers.id, {
        blockedBalance: consumer.blockedBalance - item.cashbackAmount,
        balance: consumer.balance + item.cashbackAmount,
      });
    });

    const paymentOrder = await getRepository(PaymentOrder).findOne({
      where: { id: orderId },
      relations: ["company"],
    });

    const updatedCompanyBalance = await getRepository(Companies).update(
      paymentOrder.company.id,
      {
        negativeBalance:
          paymentOrder.company.negativeBalance - paymentOrder.value,
      }
    );

    if (updatedCompanyBalance.affected === 0) {
      throw new InternalError("Erro ao atualizar saldo da empresa", 400);
    }

    const orderStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Autorizada" },
    });

    const updatedOrderStatus = await getRepository(PaymentOrder).update(
      orderId,
      {
        status: orderStatus,
      }
    );

    if (updatedOrderStatus.affected === 0) {
      throw new InternalError("Erro ao autorizar ordem de pagamento", 400);
    }

    return "Ordem de Pagamento aprovada!";
  }
}

export { ApproveOrderUseCase };
