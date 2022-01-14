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
      .createQueryBuilder("t")
      .select([
        "t.id",
        "t.value",
        "t.dateAt",
        "t.cashbackPercent",
        "t.cashbackAmount",
      ])
      .addSelect(["c.fullName", "cu.name"])
      .leftJoin(Consumers, "c", "c.id = t.consumers")
      .leftJoin(CompanyUsers, "cu", "cu.id = t.companyUsers")
      .leftJoin(TransactionStatus, "ts", "ts.id = t.transactionStatus")
      .leftJoin(TransactionTypes, "tt", "tt.id = t.transactionTypes")
      .where("tt.description = :description", { description: "Ganho" })
      .andWhere("ts.description = :name", { name: "Pendente" })
      .andWhere("t.companies = :companyId", { companyId })
      .orderBy("t.id")
      .getRawMany();

    return cashbacks;
  }
}

export { FindCashbacksUseCase };
