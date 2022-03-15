import { Request, Response } from "express";
import { TotalizerReportUseCase } from "./TotalizerReportUseCase";
import { CashbacksByPaymentMethodReportUseCase } from "./CashbacksByPaymentMethodReportUseCase";
import { CashbacksByMonthUseCase } from "./CashbacksByMonthUseCase";
import { BillingCashbacksByMonthUseCase } from "./BillingCashbacksByMonthUseCase";

class DashboardController {
  async dashboardReport(request: Request, response: Response) {
    const totalizersReport = new TotalizerReportUseCase();
    const transactionsReport = new CashbacksByPaymentMethodReportUseCase();
    const cashbackMonthly = new CashbacksByMonthUseCase();
    const billingReport = new BillingCashbacksByMonthUseCase();

    const totalizers = await totalizersReport.execute();
    const transactions = await transactionsReport.execute();
    const cashbacksMonthly = await cashbackMonthly.execute();
    const billingcashbacksByMonth = await billingReport.execute();

    return response.status(200).json({ cashbacksMonthly });
  }
}

export { DashboardController };
