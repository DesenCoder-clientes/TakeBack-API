import { getRepository, In } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";
import { TransactionStatus } from "../../../models/TransactionStatus";

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

    return { consumer, companies, transactions };
  }
}

export { CostumerFindAppDataUseCase };
