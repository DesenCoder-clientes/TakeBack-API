import { Request, Response } from "express";
import { ReportCashbackPerPaymentMethodUseCase } from "./ReportCashbackPerPaymentMethodUseCase";
import { ReportCompanyActiveInactiveUseCase } from "./ReportCompanyActiveInactiveUseCase";
import { ReportConsumerActiveInactiveUseCase } from "./ReportConsumerActiveInactiveUseCase";
import { ReportTotalRevenuesUseCase } from "./ReportTotalRevenuesUseCase";
import { ReportTotalPayableUseCase } from "./ReportTotalPayableUseCase";
import { ReportTotalReceivableUseCase } from "./ReportTotalReceivableUseCase";

class DashboardController {
  async dashboardReport(request: Request, response: Response) {
    const consumerReport = new ReportConsumerActiveInactiveUseCase();
    const companyReport = new ReportCompanyActiveInactiveUseCase();
    const totalReceivableReport = new ReportTotalReceivableUseCase();
    const totalPayableReport = new ReportTotalPayableUseCase();
    const revenuesReport = new ReportTotalRevenuesUseCase();
    const cashbackReport = new ReportCashbackPerPaymentMethodUseCase();

    const companyStatus = await companyReport.execute();

    response.status(200).json({
      companyStatus,
    });
  }
}

export { DashboardController };
