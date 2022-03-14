import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

class VerifyProvionalAccessUseCase {
  async execute() {
    const provisonalAccess = await getRepository(CompanyStatus).findOne({
      where: { description: "Liberação provisória" },
    });

    const companiesInProvisionalAccess = await getRepository(Companies).find({
      where: { status: provisonalAccess },
      relations: ["status"],
    });

    const today = new Date();
    companiesInProvisionalAccess.map((item) => {
      let provisionalAccessDate = new Date(item.provisionalAccessAllowedAt);

      let expirateDate = new Date(
        provisionalAccessDate.setDate(provisionalAccessDate.getDate() + 3)
      );

      if (today > expirateDate) {
        console.log("EMPRESA BLOQUEADA");
      }
    });

    return "ok";
  }
}

export { VerifyProvionalAccessUseCase };
