import { getRepository } from "typeorm";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";

interface FilterProps {
  statusId?: string;
  typeId?: string;
}
interface Props {
  companyId: string;
  filters?: FilterProps;
}

class FindCashbacksUseCase {
  async execute({ companyId, filters }: Props) {
    const query = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.value",
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
      .leftJoin(
        TransactionTypes,
        "type",
        "type.id = transaction.transactionTypes"
      )
      .where("transaction.companies = :companyId", { companyId })
      .orderBy("transaction.id");

    if (filters.statusId) {
      query.andWhere("status.id = :statusId", {
        statusId: parseInt(filters.statusId),
      });
    }

    if (filters.typeId) {
      query.andWhere("type.description = :typeId", { typeId: filters.typeId });
    }

    const cashbacks = query.getRawMany();

    return cashbacks;
  }
}

export { FindCashbacksUseCase };
