import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface CostumerProps {
  consumerID: string;
}

class DesactiveCostumerUseCase {
  async execute({ consumerID }: CostumerProps) {
    const { affected } = await getRepository(Consumers).update(consumerID, {
      deactivedAccount: true,
    });

    if (affected === 0) {
      throw new InternalError("Erro ao desativar conta", 404);
    }

    return "Conta desativada";
  }
}

export { DesactiveCostumerUseCase };
