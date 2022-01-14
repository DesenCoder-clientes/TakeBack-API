import { getRepository, Not } from "typeorm";
import { Transactions } from "../../../models/Transaction";

interface FindTransactionProps {
  offset: string;
  limit: string;
  consumerID: string;
}

class CostumerFindTransactionUseCase {
  async execute({ offset, limit, consumerID }: FindTransactionProps) {
    const transactions = await getRepository(Transactions).find({
      select: ["id", "cashbackAmount", "createdAt"],
      relations: ["companies", "transactionTypes", "transactionStatus"],
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
      order: { createdAt: "DESC" },
      where: {
        consumers: consumerID,
        transactionStatus: {
          description: Not("Aguardando"),
        },
      },
    });

    if (transactions.length === 0) {
      return false;
    }

    return transactions;
  }
}

export { CostumerFindTransactionUseCase };
