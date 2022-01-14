import { getRepository, Not } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { Consumers } from "../../../models/Consumer";
import { Transactions } from "../../../models/Transaction";

interface FindAppProps {
  consumerID: string;
}

class CostumerFindAppDataUseCase {
  async execute({ consumerID }: FindAppProps) {
    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName", "createdAt"],
      relations: ["industry"],
      take: 20,
      order: { createdAt: "ASC" },
    });

    const consumer = await getRepository(Consumers).findOne(consumerID, {
      relations: ["address", "address.city", "address.city.state"],
    });

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

    if (!consumer) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    return { consumer, companies, transactions };
  }
}

export { CostumerFindAppDataUseCase };
