import { getRepository, Transaction } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Transactions } from "../../../models/Transaction";

interface Props {
  transactionIDs: number[];
}

class GeneratePaymentOrderUseCase {
  async execute({ transactionIDs }: Props) {
    if (transactionIDs.length === 0) {
      throw new InternalError("Campos incompletos", 400);
    }

    /* const inProcess = await getRepository(Transactions).findOne({
        where:{transactionStatus.description: "Em processamento"}
    }) */
  }
}

export { GeneratePaymentOrderUseCase };
