import { getRepository, Not } from "typeorm";
import { Companies } from "../../../models/Company";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface FindTransactionProps {
  offset: string;
  limit: string;
  consumerID: string;
}

class CostumerFindTransactionUseCase {
  async execute({ offset, limit, consumerID }: FindTransactionProps) {
    // const transactions = await getRepository(Transactions).find({
    //   select: ["id", "cashbackAmount", "createdAt"],
    //   relations: ["companies", "transactionTypes", "transactionStatus"],
    //   take: parseInt(limit),
    //   skip: parseInt(offset) * parseInt(limit),
    //   order: { createdAt: "DESC" },
    //   where: {
    //     consumers: consumerID,
    //     transactionStatus: {
    //       description: Not("Aguardando"),
    //     },
    //   },
    // });

    const transactions = await getRepository(Transactions)
      .createQueryBuilder("t")
      .select(["t.id", "t.cashbackAmount", "t.createdAt"])
      .addSelect([
        "c.fantasyName",
        "ts.description",
        "ts.id",
        "ts.blocked",
        // "tt.isUp",
      ])
      .leftJoin(Companies, "c", "c.id = t.companies")
      .leftJoin(TransactionStatus, "ts", "ts.id = t.transactionStatus")
      // .leftJoin(TransactionTypes, "tt", "tt.id = t.transactionTypes")
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .where("t.consumers = :consumerId", { consumerId: consumerID })
      .andWhere("ts.description <> :status", { status: "Aguardando" })
      .orderBy("t.createdAt", "DESC")
      .getRawMany();

    if (transactions.length === 0) {
      return false;
    }

    return transactions;
  }
}

export { CostumerFindTransactionUseCase };
