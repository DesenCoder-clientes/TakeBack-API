import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";

class FindFiltersOptionsUseCase {
  async execute() {
    const companies = await getRepository(Companies).find({
      select: ["id", "fantasyName"],
    });

    return companies;
  }
}

export { FindFiltersOptionsUseCase };
