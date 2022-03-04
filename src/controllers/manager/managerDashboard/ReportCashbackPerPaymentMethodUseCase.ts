import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  id: string;
}

class ReportCashbackPerPaymentMethodUseCase {
  async execute({ id }: Props) {
    return "Cashbacks por forma de pagamento (gráfico em colunas)";
  }
}

export { ReportCashbackPerPaymentMethodUseCase };
