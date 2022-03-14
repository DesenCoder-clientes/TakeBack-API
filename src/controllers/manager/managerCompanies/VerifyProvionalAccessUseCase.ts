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
    const blockedStatus = await getRepository(CompanyStatus).findOne({
      where: { description: "Bloqueado" },
    });

    companiesInProvisionalAccess.map(async (item) => {
      let provisionalAccessDate = new Date(item.provisionalAccessAllowedAt);

      let expirateDate = new Date(
        provisionalAccessDate.setDate(provisionalAccessDate.getDate() + 3)
      );

      if (today > expirateDate) {
        await getRepository(Companies).update(item.id, {
          status: blockedStatus,
        });
      }
    });

    return "ok";
  }
}

export { VerifyProvionalAccessUseCase };
