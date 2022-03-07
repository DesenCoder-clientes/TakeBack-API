import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { Consumers } from "../../../models/Consumer";
import { ConsumerAddress } from "../../../models/ConsumerAddress";

interface PaginationProps {
  limit: string;
  offset: string;
}

interface QueryProps {
  status?: string;
  city?: string;
}

interface Props {
  pagination: PaginationProps;
  filters: QueryProps;
}

class ListConsumersUseCase {
  async execute({ pagination: { limit, offset }, filters }: Props) {
    const query = getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select([
        "consumer.id",
        "consumer.createdAt",
        "consumer.fullName",
        "consumer.balance",
        "consumer.blockedBalance",
        "consumer.deactivedAccount",
      ])
      .addSelect(["city.name"])
      .leftJoin(ConsumerAddress, "address", "address.id = consumer.address")
      .leftJoin(City, "city", "city.id = address.city")
      .where("consumer.deactivedAccount IN (:...status)", {
        status: filters.status ? [filters.status == "2"] : [true, false],
      })
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit));

    if (filters.city) {
      query.andWhere("city.id = :cityId", { cityId: filters.city });
    }

    const consumers = await query.getRawMany();

    return consumers;
  }
}

export { ListConsumersUseCase };
