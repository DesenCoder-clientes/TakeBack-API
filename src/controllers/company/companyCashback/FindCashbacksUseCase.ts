import { getRepository } from "typeorm";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { Consumers } from "../../../models/Consumer";
import { PaymentMethods } from "../../../models/PaymentMethod";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
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
      .leftJoin(Consumers, "c", "c.id = t.consumerId")
      .leftJoin(CompanyUsers, "cu", "cu.id = t.companyUserId")
      .leftJoin(TransactionStatus, "ts", "ts.id = t.transactionStatusId")
      .leftJoin(TransactionTypes, "tt", "tt.id = t.transactionTypeId")
      .where("tt.description = :description", { description: "Ganho" })
      .andWhere("ts.description = :name", { name: "Pendente" })
      .andWhere("t.companyId = :companyId", { companyId })
      .orderBy("t.id")
      .getRawMany();

    return cashbacks;
  }
}

export { FindCashbacksUseCase };
