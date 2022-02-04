import { getRepository } from "typeorm";
import { CompanyStatus } from "../../../models/CompanyStatus";

class FindCompanyStatusUseCase {
  async execute() {
    const status = await getRepository(CompanyStatus).find({
      select: ["id", "description"],
      order: { description: "ASC" },
    });

    return status;
  }
}

export { FindCompanyStatusUseCase };
