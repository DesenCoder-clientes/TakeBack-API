import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Transactions } from "../../../models/Transaction";

interface DropTransactionProps {
  transactionID: string;
}

class CostumerDropTransactionUseCase {
  async execute({ transactionID }: DropTransactionProps) {
    const transaction = await getRepository(Transactions).findOne(
      transactionID,
      {
        relations: ["transactionStatus"],
      }
    );

    if (transaction.transactionStatus.description !== "Aguardando") {
      throw new InternalError("Erro ao inutilizar código", 200);
    }

    await getRepository(Transactions).delete(transactionID);

    return "Operação cancelada";
  }
}

export { CostumerDropTransactionUseCase };
