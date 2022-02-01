import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyStatus } from "../../../models/CompanyStatus";

class FindaCompanyStatusUseCase {
  async execute() {
    const status = await getRepository(CompanyStatus).find({
      select: ["id", "description", "blocked"],
      relations: ["company"],
      order: { description: "ASC" },
    });

    if (!status) {
      throw new InternalError("Não há ramos cadastrados", 400);
    }

    return status;
  }
}

export { FindaCompanyStatusUseCase };
