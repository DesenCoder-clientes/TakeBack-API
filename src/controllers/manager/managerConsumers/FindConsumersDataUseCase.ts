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
      .createQueryBuilder("c")
      .select([
        "c.id",
        "c.fullName",
        "c.birthDate",
        "c.createdAt",
        "c.phone",
        "c.email",
        "c.cpf",
        "c.signatureRegistered",
        "c.balance",
        "c.blockedBalance",
        "c.emailConfirmated",
        "c.deactivedAccount",
      ])
      .addSelect([
        "ca.street",
        "ca.district",
        "ca.number",
        "ca.complement",
        "ci.name",
        "ci.state",
        "ci.zipCode",
      ])
      .leftJoin(ConsumerAddress, "ca", "ca.id = c.address")
      .leftJoin(City, "ci", "ci.id = ca.city")
      .where("c.id = :consumerId", {
        consumerId,
      })
      .getRawMany();

    return consumersData;
  }
}

export { FindConsumersDataUseCase };
