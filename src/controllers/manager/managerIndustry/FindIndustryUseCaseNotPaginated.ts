import { getRepository } from "typeorm";
import { Industries } from "../../../models/Industry";

class FindIndustryUseCaseNotPaginated {
  async execute() {
    const industriesNotPaginated = await getRepository(Industries).find({
      order: { id: "ASC" },
    });

    return industriesNotPaginated;
  }
}

export { FindIndustryUseCaseNotPaginated };
