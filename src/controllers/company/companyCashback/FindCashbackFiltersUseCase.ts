import { getRepository } from "typeorm";
import { TransactionStatus } from "../../../models/TransactionStatus";

class FindCashbackFiltersUseCase {
  async execute() {
    const status = await getRepository(TransactionStatus).find();

    return status;
  }
}

export { FindCashbackFiltersUseCase };
