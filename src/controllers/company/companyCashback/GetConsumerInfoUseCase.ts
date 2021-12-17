import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  cpf: string;
}

class GetComsumerInfoUseCase {
  async execute({ cpf }: Props) {
    if (!cpf) {
      throw new InternalError("CPF não informado", 400);
    }

    if (cpf.length !== 11) {
      throw new InternalError("CPF inválido", 400);
    }

    const consumer = await getRepository(Consumers).findOne({
      select: ["fullName"],
      where: { cpf },
    });

    if (!consumer) {
      throw new InternalError("O cliente não possui cadastro", 404);
    }

    return consumer;
  }
}

export { GetComsumerInfoUseCase };
