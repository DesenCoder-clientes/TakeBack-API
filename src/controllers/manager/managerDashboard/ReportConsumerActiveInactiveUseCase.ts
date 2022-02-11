import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

class ReportConsumerActiveInactiveUseCase {
  async execute() {
    return "Clientes Ativos x Clientes Inativos (gráfico em rosca)";
  }
}

export { ReportConsumerActiveInactiveUseCase };
