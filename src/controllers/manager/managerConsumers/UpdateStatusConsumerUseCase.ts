import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  deactivedAccount: boolean;
  id: string;
}

class UpdateStatusConsumerUseCase {
  async execute({ deactivedAccount, id }: Props) {
    const consumer = await getRepository(Consumers).findOne({
      where: { id },
    });

    if (!consumer) {
      throw new InternalError("Cliente não encontrado", 404);
    }

    const updateConsumerStatus = await getRepository(Consumers).update(id, {
      deactivedAccount,
    });

    if (updateConsumerStatus.affected === 0) {
      throw new InternalError("Erro ao atualizar usuário", 500);
    }

    return "Usuário atualizado";
  }
}

export { UpdateStatusConsumerUseCase };
