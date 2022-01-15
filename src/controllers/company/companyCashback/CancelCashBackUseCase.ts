import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
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
    });

    return true;
  }
}

export { CancelCashBackUseCase };
