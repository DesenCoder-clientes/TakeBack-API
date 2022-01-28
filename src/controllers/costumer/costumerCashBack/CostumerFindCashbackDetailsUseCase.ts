import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyPaymentMethods } from "../../../models/CompanyPaymentMethod";
import { PaymentMethods } from "../../../models/PaymentMethod";
import { Transactions } from "../../../models/Transaction";
import { TransactionPaymentMethods } from "../../../models/TransactionPaymentMethod";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";

interface FindAppProps {
  transactionID: number;
}

class CostumerFindCashbackDetailsUseCase {
  async execute({ transactionID }: FindAppProps) {
    const transactions = await getRepository(Transactions)
      .createQueryBuilder("t")
      .select([
        "t.id",
        "t.value",
        "t.cashbackPercent",
        "t.cashbackAmount",
        "t.cancellationDescription",
        "t.createdAt",
      ])
      .addSelect([
        "c.fantasyName",
        "ca.street",
        "ca.district",
        "ca.number",
        "city.name",
        "ts.id",
        "ts.description",
        "tt.isUp",
      ])
      .leftJoin(Companies, "c", "c.id = t.companies")
      .leftJoin(CompaniesAddress, "ca", "ca.id = c.address")
      .leftJoin(City, "city", "city.id = ca.city")
      .leftJoin(TransactionStatus, "ts", "ts.id = t.transactionStatus")
      .leftJoin(TransactionTypes, "tt", "tt.id = t.transactionTypes")
      .where("t.id = :transactionID", { transactionID })
      .getRawOne();

    const paymentMethods = await getRepository(TransactionPaymentMethods)
      .createQueryBuilder("tpm")
      .select(["tpm.id", "tpm.cashbackPercentage", "tpm.cashbackValue"])
      .addSelect(["pm.description"])
      .leftJoin(CompanyPaymentMethods, "cpm", "cpm.id = tpm.paymentMethod")
      .leftJoin(PaymentMethods, "pm", "pm.id = cpm.paymentMethod")
      .leftJoin(Transactions, "t", "t.id = tpm.transactions")
      .where("t.id = :transactionID", { transactionID })
      .getRawMany();

    return { transactions, paymentMethods };
  }
}

export { CostumerFindCashbackDetailsUseCase };
