import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { Consumers } from "../../../models/Consumer";
import { ConsumerAddress } from "../../../models/ConsumerAddress";

interface Props {
  consumerId: string;
}

class FindConsumersDataUseCase {
  async execute({ consumerId }: Props) {
    const consumersData = await getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select([
        "consumer.id",
        "consumer.fullName",
        "consumer.birthDate",
        "consumer.createdAt",
        "consumer.phone",
        "consumer.email",
        "consumer.cpf",
        "consumer.signatureRegistered",
        "consumer.balance",
        "consumer.blockedBalance",
        "consumer.emailConfirmated",
        "consumer.deactivedAccount",
      ])
      .addSelect([
        "address.street",
        "address.district",
        "address.number",
        "address.complement",
        "city.name",
        "city.state",
        "city.zipCode",
      ])
      .leftJoin(ConsumerAddress, "address", "address.id = consumer.address")
      .leftJoin(City, "city", "city.id = address.city")
      .where("consumer.id = :consumerId", {
        consumerId,
      })
      .getRawOne();

    return consumersData;
  }
}

export { FindConsumersDataUseCase };
