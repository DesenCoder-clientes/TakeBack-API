import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Industries } from "../../../models/Industry";

class FindIndustryUseCaseNotPaginated {
  async execute() {
    const industriesNotPaginated = await getRepository(Industries).find({
      select: ["id", "description", "industryFee", "createdAt", "updatedAt"],
      relations: ["companies"],
      order: { id: "ASC" },
    });

    if (!industriesNotPaginated) {
      throw new InternalError("Não há ramos cadastrados", 400);
    }

    return industriesNotPaginated;
  }
}

export { FindIndustryUseCaseNotPaginated };
