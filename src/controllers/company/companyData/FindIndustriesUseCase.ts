import { getRepository } from "typeorm";
import { Industries } from "../../../models/Industry";

class FindIndustriesUseCase {
  async execute() {
    const industries = await getRepository(Industries).find();

    return industries;
  }
}

export { FindIndustriesUseCase };
