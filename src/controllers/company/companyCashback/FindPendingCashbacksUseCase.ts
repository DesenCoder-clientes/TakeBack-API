import { getRepository } from "typeorm";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface Props {
  companyId: string;
}

class FindPendingCashbacksUseCase {
  async execute({ companyId }: Props) {
    const cashbacks = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.totalAmount",
        "transaction.dateAt",
        "transaction.takebackFeeAmount",
        "transaction.cashbackAmount",
      ])
      .addSelect(["consumer.fullName", "status.description"])
      .leftJoin(Consumers, "consumer", "consumer.id = transaction.consumers")
      .leftJoin(CompanyUsers, "user", "user.id = transaction.companyUsers")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .where("transaction.companies = :companyId", { companyId })
      .andWhere("status.description = :status", { status: "Pendente" })
      .orderBy("transaction.id")
      .getRawMany();

    return cashbacks;
  }
}

export { FindPendingCashbacksUseCase };
