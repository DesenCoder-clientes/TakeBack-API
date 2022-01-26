import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface ConsumerRequestToUpdatePhone {
  phone: string;
  consumerID: string;
}

class CostumerUpdatePhoneUseCase {
  async execute({ phone, consumerID }: ConsumerRequestToUpdatePhone) {
    if (!phone) {
      throw new InternalError("Dados não informados", 400);
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      phone,
    });

    if (affected === 0) {
      throw new InternalError("Houve um erro", 417);
    }
    const consumer = await getRepository(Consumers).findOne(consumerID, {
      relations: ["address", "address.city", "address.city.state"],
    });

    return consumer;
  }
}

export { CostumerUpdatePhoneUseCase };
