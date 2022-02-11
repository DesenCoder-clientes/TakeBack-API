import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  id: string;
}

class ReportCompanyActiveInactiveUseCase {
  async execute({ id }: Props) {
    return "Empresas Ativas x Empresas Inativas (gráfico em rosca)";
  }
}

export { ReportCompanyActiveInactiveUseCase };
