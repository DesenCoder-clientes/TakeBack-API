import { getRepository, In } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

class UpdateCompanyPaymentMonthlyToFalseUseCase {
  async execute() {
    let statusIds = [];
    const status = await getRepository(CompanyStatus).find({
      where: { blocked: false },
    });

    status.map((item) => {
      statusIds.push(item.id);
    });

    const company = await getRepository(Companies).find({
      where: { status: In([...statusIds]) },
    });

    company.map(async (item) => {
      await getRepository(Companies).update(item.id, {
        currentMonthlyPaymentPaid: false,
      });
    });

    return "ok";
  }
}

export { UpdateCompanyPaymentMonthlyToFalseUseCase };
