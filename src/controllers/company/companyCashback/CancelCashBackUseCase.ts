import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Transactions } from "../../../models/Transaction";

interface CancelProps {
  companyID: string;
  transactionIDs: string;
  cancellationDescription: string;
}

class CancelCashBackUseCase {
  async execute({
    companyID,
    cancellationDescription,
    transactionIDs,
  }: CancelProps) {
    if (!cancellationDescription || !transactionIDs) {
      throw new InternalError("Campos incompletos", 401);
    }

    const company = await getRepository(Companies).findOne(companyID);

    const transaction = await getRepository(Transactions).find({
      select: ["id"],
      where: { companies: company },
    });

    if (!transaction) {
      throw new InternalError("Erro ao procurar transação", 401);
    }

    const transactionsIDs = [];
    transaction.map((item) => {
      transactionsIDs.push(item.id);
    });

    await getRepository(Transactions).delete(transactionsIDs);
  }
}

export { CancelCashBackUseCase };
