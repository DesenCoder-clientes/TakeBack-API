import { getRepository } from "typeorm";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";

interface Props {
  companyId: string;
}

class FindCashbacksUseCase {
  async execute({ companyId }: Props) {
    const cashbacks = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.value",
        "transaction.dateAt",
        "transaction.cashbackPercent",
        "transaction.cashbackAmount",
      ])
      .addSelect(["consumer.fullName", "user.name"])
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .leftJoin(CompanyUsers, "user", "user.id = transaction.companyUsers")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .leftJoin(
        TransactionTypes,
        "type",
        "type.id = transaction.transactionTypes"
      )
      .where("type.description = :description", { description: "Ganho" })
      .andWhere("status.description = :name", { name: "Pendente" })
      .andWhere("transaction.companies = :companyId", { companyId })
      .orderBy("transaction.id")
      .getRawMany();

    return cashbacks;
  }
}

export { FindCashbacksUseCase };
