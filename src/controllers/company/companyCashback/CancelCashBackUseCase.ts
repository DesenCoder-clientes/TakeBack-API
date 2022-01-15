import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface CancelProps {
  transactionIDs: number[];
  cancellationDescription: string;
}

class CancelCashBackUseCase {
  async execute({ cancellationDescription, transactionIDs }: CancelProps) {
    if (!cancellationDescription || transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    const status = await getRepository(TransactionStatus).findOne({
      where: { description: "Cancelada pelo parceiro" },
    });

    if (!status) {
      throw new InternalError("Erro ao cancelar transação", 400);
    }

    transactionIDs.map(async (id) => {
      const { affected } = await getRepository(Transactions).update(id, {
        transactionStatus: status,
        cancellationDescription,
      });

      if (!affected) {
        throw new InternalError(`Erro ao cancelar a transação: ${id}`, 400);
      }

      const transaction = await getRepository(Transactions).findOne(id, {
        select: ["cashbackAmount"],
        relations: ["consumers"],
      });

      const costumer = await getRepository(Consumers).findOne(
        transaction.consumers.id
      );

      const updatedBalanceCostumer = await getRepository(Consumers).update(
        costumer.id,
        {
          blockedBalance: costumer.blockedBalance - transaction.cashbackAmount,
        }
      );

      if (updatedBalanceCostumer.affected === 0) {
        throw new InternalError("Erro ao atualizar o saldo do cliente", 400); // Alterar mensagem
      }
    });

    return true;
  }
}

export { CancelCashBackUseCase };