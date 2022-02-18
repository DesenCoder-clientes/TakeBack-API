import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";
import { TransactionTypes } from "../../../models/TransactionType";

interface FindAppProps {
  consumerID: string;
}

class CostumerFindAppDataUseCase {
  async execute({ consumerID }: FindAppProps) {
    const status = await getRepository(CompanyStatus).find({
      where: { blocked: false },
    });

    const statusIds = [];
    status.map((item) => {
      statusIds.push(item.id);
    });

    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName", "createdAt"],
      where: { status: In([...statusIds]) },
      relations: ["industry"],
      take: 20,
      order: { createdAt: "ASC" },
    });

    const consumer = await getRepository(Consumers).findOne({
      where: { id: consumerID },
      relations: ["address", "address.city", "address.city.state"],
    });

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    const transactions = await getRepository(Transactions)
      .createQueryBuilder("t")
      .select(["t.id", "t.cashbackAmount", "t.createdAt", "t.value"])
      .addSelect([
        "c.fantasyName",
        "ts.description",
        "ts.id",
        "ts.blocked",
        "tt.isUp",
      ])
      .leftJoin(Companies, "c", "c.id = t.companies")
      .leftJoin(TransactionStatus, "ts", "ts.id = t.transactionStatus")
      .leftJoin(TransactionTypes, "tt", "tt.id = t.transactionTypes")
      .limit(20)
      .where("t.consumers = :consumerId", { consumerId: consumerID })
      .andWhere("ts.description <> :status", { status: "Aguardando" })
      .orderBy("t.createdAt", "DESC")
      .getRawMany();

    return { consumer, companies, transactions };
  }
}

export { CostumerFindAppDataUseCase };
