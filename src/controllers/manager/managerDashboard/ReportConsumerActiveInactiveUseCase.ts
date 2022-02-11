import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  id: string;
}

class ReportConsumerActiveInactiveUseCase {
  async execute({ id }: Props) {
    return "Clientes Ativos x Clientes Inativos (gráfico em rosca)";
  }
}

export { ReportConsumerActiveInactiveUseCase };
