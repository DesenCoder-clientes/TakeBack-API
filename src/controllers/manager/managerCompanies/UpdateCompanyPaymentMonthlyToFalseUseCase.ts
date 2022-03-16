import { getRepository, In } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyMonthlyPayment } from "../../../models/CompanyMonthlyPayment";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { PaymentPlans } from "../../../models/PaymentPlans";

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

      const companyFinded = await getRepository(Companies).findOne({
        where: { id: item.id },
        relations: ["paymentPlan"],
      });

      const companyPlan = await getRepository(PaymentPlans).findOne({
        where: { id: companyFinded.paymentPlan.id },
      });

      await getRepository(CompanyMonthlyPayment).save({
        company: companyFinded,
        plan: companyPlan,
      });
    });

    return "ok";
  }
}

export { UpdateCompanyPaymentMonthlyToFalseUseCase };
