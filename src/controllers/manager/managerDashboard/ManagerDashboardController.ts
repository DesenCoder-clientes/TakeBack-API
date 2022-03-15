import { Request, Response } from "express";
import { TotalizerReportUseCase } from "./TotalizerReportUseCase";
import { CashbacksByPaymentMethodReportUseCase } from "./CashbacksByPaymentMethodReportUseCase";
import { CashbacksByMonthlyUseCase } from "./CashbacksByMonthlyUseCase";

class DashboardController {
  async dashboardReport(request: Request, response: Response) {
    const totalizersReport = new TotalizerReportUseCase();
    const transactionsReport = new CashbacksByPaymentMethodReportUseCase();
    const cashbackMonthly = new CashbacksByMonthlyUseCase();

    const totalizers = await totalizersReport.execute();
    const transactions = await transactionsReport.execute();
    const cashbacksMonthly = await cashbackMonthly.execute();

    return response.status(200).json({ cashbacksMonthly });
  }
}

export { DashboardController };
