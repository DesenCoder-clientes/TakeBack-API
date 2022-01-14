import { InternalError } from "../../../config/GenerateErros";

interface CostumerProps{
    consumerID: string
}

class DesactiveCostumerUseCase{
    async execute({consumerID}: ){
        const consumerID = request["tokenPayload"].id;

    const { affected } = await getRepository(Consumers).update(consumerID, {
      deactivedAccount: true,
    });

    if (affected === 1) {
      return response.status(200).json({ message: "Conta desativada" });
    }

    return response.status(404).json({ message: "Erro ao desativar conta" });
  }
    }
}

export{DesactiveCostumerUseCase}