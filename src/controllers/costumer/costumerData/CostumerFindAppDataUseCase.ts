import { getRepository, In, Not } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";

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

    const transactions = await getRepository(Transactions).find({
      select: ["id", "cashbackAmount", "createdAt"],
      relations: ["companies", "transactionTypes", "transactionStatus"],
      take: 20,
      order: { createdAt: "DESC" },
      where: {
        consumers: consumer,
        transactionStatus: {
          description: Not("Aguardando"),
        },
      },
    });

    return { consumer, companies, transactions };
  }
}

export { CostumerFindAppDataUseCase };
