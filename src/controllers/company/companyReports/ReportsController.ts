import { Request, Response } from "express";
// import { FindAppDataUseCase } from "./FindAppDataUseCase";

import { ReportCashbackByPeriodUseCase } from "./ReportCashbackByPeriodUseCase";
import { ReportCashbackByPaymentMethodUseCase } from "./ReportCashbackByPaymentMethodUseCase";
import { CompanyBalanceUseCase } from "./CompanyBalanceUseCase";

class ReportsController {
  async dashboardReports(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];

    const cashbacksByPeriod = new ReportCashbackByPeriodUseCase();
    const billingReport = new CompanyBalanceUseCase();
    const cashbacksByPaymentMethods =
      new ReportCashbackByPaymentMethodUseCase();

    const report1 = await cashbacksByPeriod.execute({
      companyId,
      userId,
    });

    const report2 = await cashbacksByPaymentMethods.execute({
      companyId,
    });

    const report3 = await billingReport.execute({ companyId });

    return response.status(200).json({ report1, report2, report3 });
  }
}

export { ReportsController };
