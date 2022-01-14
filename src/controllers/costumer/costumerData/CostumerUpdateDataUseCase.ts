import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface ConsumerRequestToUpdateData {
  fullName: string;
  birthDate: Date;
  consumerID: string;
}

class CostumerUpdateDataUseCase {
  async execute({
    fullName,
    birthDate,
    consumerID,
  }: ConsumerRequestToUpdateData) {
    if (!fullName || !birthDate || !consumerID) {
      throw new InternalError("Dados incompletos", 400);
    }

    const { affected } = await getRepository(Consumers).update(consumerID, {
      fullName,
      birthDate,
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

export { CostumerUpdateDataUseCase };
