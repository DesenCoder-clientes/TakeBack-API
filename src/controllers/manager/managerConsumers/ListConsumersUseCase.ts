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
  query: QueryProps;
}

class ListConsumersUseCase {
  async execute({
    pagination: { limit, offset },
    query: { city, status },
  }: Props) {
    const cities = await getRepository(City).find({
      select: ["id"],
    });

    const cityIds = [];
    cities.map((item) => {
      cityIds.push(item.id);
    });

    const listConsumers = await getRepository(Consumers)
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
      .addSelect(["ci.name"])
      .leftJoin(ConsumerAddress, "ca", "ca.id = c.address")
      .leftJoin(City, "ci", "ci.id = ca.city")
      .where("c.deactivedAccount IN (:...status)", {
        status: status ? [status == "2"] : [true, false],
      })
      .andWhere("ci.id IN (:...cityId)", {
        cityId: city ? [city] : [...cityIds],
      })
      .limit(parseInt(limit))
      .offset(parseInt(offset) * parseInt(limit))
      .getRawMany();

    return listConsumers;
  }
}

export { ListConsumersUseCase };
