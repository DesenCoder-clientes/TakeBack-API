import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  id: string;
}

class ReportTotalRevenuesUseCase {
  async execute({ id }: Props) {
    return "Faturamento total";
  }
}

export { ReportTotalRevenuesUseCase };
