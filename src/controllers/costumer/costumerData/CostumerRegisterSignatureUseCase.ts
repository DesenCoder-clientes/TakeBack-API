import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface ConsumerRequestToRegisterSignature {
  newSignature: string;
  consumerID: string;
}

class CostumerRegisterSignatureUseCase {
  async execute({
    newSignature,
    consumerID,
  }: ConsumerRequestToRegisterSignature) {
    if (!newSignature || newSignature.length != 4) {
      throw new InternalError("Dados não informados", 400);
    }

    const newSignatureEncrypted = bcrypt.hashSync(newSignature, 10);

    const { affected } = await getRepository(Consumers).update(consumerID, {
      signature: newSignatureEncrypted,
      signatureRegistered: true,
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

export { CostumerRegisterSignatureUseCase };
