import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Consumers } from "../../../models/Consumer";
import { Industries } from "../../../models/Industry";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

interface FindAppProps {
  consumerID: string;
}

class CostumerFindAppDataUseCase {
  async execute({ consumerID }: FindAppProps) {
    const companies = await getRepository(Companies)
      .createQueryBuilder("company")
      .select(["company.id", "company.fantasyName", "company.createdAt"])
      .addSelect(["industry.id", "industry.description"])
      .leftJoin(Industries, "industry", "industry.id = company.industry")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .leftJoin(CompaniesAddress, "address", "address.id = company.address")
      .leftJoin(City, "city", "city.id = address.city")
      .where("status.blocked = :bloqued", { bloqued: false })
      .limit(4)
      .offset(0)
      .orderBy("company.fantasyName", "ASC")
      .getRawMany();

    const consumer = await getRepository(Consumers).findOne({
      where: { id: consumerID },
      relations: ["address", "address.city", "address.city.state"],
    });

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    const transactions = await getRepository(Transactions)
      .createQueryBuilder("transaction")
      .select([
        "transaction.id",
        "transaction.cashbackAmount",
        "transaction.createdAt",
        "transaction.totalAmount",
      ])
      .addSelect([
        "company.fantasyName",
        "status.description",
        "status.id",
        "status.blocked",
      ])
      .leftJoin(Companies, "company", "company.id = transaction.companies")
      .leftJoin(
        TransactionStatus,
        "status",
        "status.id = transaction.transactionStatus"
      )
      .limit(20)
      .where("transaction.consumers = :consumerId", { consumerId: consumerID })
      .andWhere("status.description <> :status", { status: "Aguardando" })
      .orderBy("transaction.createdAt", "DESC")
      .getRawMany();

    const cities = await getRepository(City).find();
    const industries = await getRepository(Industries).find();

    return { consumer, companies, transactions, cities, industries };
  }
}

export { CostumerFindAppDataUseCase };
