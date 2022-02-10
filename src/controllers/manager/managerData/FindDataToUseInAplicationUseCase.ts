import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Industries } from "../../../models/Industry";

class FindDataToUseInAplicationUseCase {
  async execute() {
    const industries = await getRepository(Industries).find({
      select: ["id", "description", "industryFee"],
      order: { id: "ASC" },
    });

    const status = await getRepository(CompanyStatus).find({
      select: ["id", "description", "blocked"],
      order: { description: "ASC" },
    });

    const cities = await getRepository(City).find({
      select: ["id", "name", "zipCode"],
      relations: ["state"],
      order: { name: "ASC" },
    });

    return { industries, status, cities };
  }
}

export { FindDataToUseInAplicationUseCase };
