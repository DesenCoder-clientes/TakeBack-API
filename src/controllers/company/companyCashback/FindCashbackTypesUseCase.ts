import { getRepository } from "typeorm";
import { TransactionTypes } from "../../../models/TransactionType";

class FindCashbackTypesUseCase {
  async execute() {
    const types = await getRepository(TransactionTypes).find();

    return types;
  }
}

export { FindCashbackTypesUseCase };
