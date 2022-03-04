import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Consumers } from "../../../models/Consumer";

interface Props {
  id: string;
}

class ReportTotalPayableUseCase {
  async execute({ id }: Props) {
    return "Total a pagar";
  }
}

export { ReportTotalPayableUseCase };
