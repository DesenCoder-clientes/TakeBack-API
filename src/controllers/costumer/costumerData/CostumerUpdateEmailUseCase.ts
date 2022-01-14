import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface ConsumerRequestToUpdateEmail {
  email: string;
  consumerID: string;
}

class CostumerUpdateEmailUseCase {
  async execute({ email, consumerID }: ConsumerRequestToUpdateEmail) {
    if (!email || !consumerID) {
      throw new InternalError("Dados não informados", 400);
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      email,
      emailConfirmated: false,
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

export { CostumerUpdateEmailUseCase };
