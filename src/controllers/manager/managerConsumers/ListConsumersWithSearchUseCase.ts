import { getRepository } from "typeorm";
import { Consumers } from "../../../models/Consumer";

interface PaginationProps {
  limit: string;
  offset: string;
}

interface QueryProps {
  searchTerm?: string;
}

interface Props {
  pagination: PaginationProps;
  query: QueryProps;
}

class ListConsumersWithSearchUseCase {
  async execute({
    pagination: { limit, offset },
    query: { searchTerm },
  }: Props) {
    const consumers = await getRepository(Consumers)
      .createQueryBuilder("c")
      .select([
        "c.id",
        "c.createdAt",
        "c.fullName",
        "c.cpf",
        "c.phone",
        "c.balance",
        "c.deactivedAccount",
        "c.blockedBalance",
      ])
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .where("c.fullName ILIKE :fullName", {
        fullName: `%${searchTerm}%`,
      })
      .orWhere("c.cpf ILIKE :cpf", {
        cpf: `%${searchTerm}%`,
      })

      .getRawMany();

    return consumers;
  }
}

export { ListConsumersWithSearchUseCase };
