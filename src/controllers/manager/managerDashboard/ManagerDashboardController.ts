import { Request, Response } from "express";
import { TotalizerReportUseCase } from "./TotalizerReportUseCase";
import { CashbacksByPaymentMethodReportUseCase } from "./CashbacksByPaymentMethodReportUseCase";
import { CashbacksByMonthUseCase } from "./CashbacksByMonthUseCase";
import { BillingPaymentMonthlyByMonthUseCase } from "./BillingPaymentMonthlyByMonthUseCase";

class DashboardController {
  async dashboardReport(request: Request, response: Response) {
    const totalizersReport = new TotalizerReportUseCase();
    const transactionsReport = new CashbacksByPaymentMethodReportUseCase();
    const cashbackMonthly = new CashbacksByMonthUseCase();
    const billingReport = new BillingPaymentMonthlyByMonthUseCase();

    const totalizers = await totalizersReport.execute();
    const cashbacksPerMethods = await transactionsReport.execute();
    const cashbacksPerMonth = await cashbackMonthly.execute();
    const billinPaymentMonthlyByMonth = await billingReport.execute();

    return response
      .status(200)
      .json({
        totalizers,
        cashbacksPerMethods,
        cashbacksPerMonth,
        billinPaymentMonthlyByMonth,
      });
  }
}

export { DashboardController };
