import { getRepository } from "typeorm";
import { CompanyMonthlyPayment } from "../../../models/CompanyMonthlyPayment";

class BillingPaymentMonthlyByMonthUseCase {
  async execute() {
    const monthlyPaiments = await getRepository(CompanyMonthlyPayment)
      .createQueryBuilder("companyMonthly")
      .select("SUM(companyMonthly.amountPaid)", "value")
      .addSelect("DATE_TRUNC('month', companyMonthly.createdAt)", "datada")
      .where("companyMonthly.isPaid = :status", { status: true })
      .groupBy("DATE_TRUNC('month', companyMonthly.createdAt)")
      .getRawMany();

    return monthlyPaiments;
  }
}

export { BillingPaymentMonthlyByMonthUseCase };
