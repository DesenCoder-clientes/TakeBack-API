import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  cpf: string;
}

class VerifyIfUserAlreadyExistsUseCase {
  async execute({ cpf }: Props) {
    if (!cpf) {
      throw new InternalError("Dados não informados", 400);
    }

    const costumer = await getRepository(Consumers).findOne({
      where: { cpf },
    });

    if (costumer) {
      throw new InternalError("CPF já cadastrado", 400);
    }

    return true;
  }
}

export { VerifyIfUserAlreadyExistsUseCase };
