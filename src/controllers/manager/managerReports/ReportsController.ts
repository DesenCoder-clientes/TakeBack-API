import { Request, Response } from "express";
import { PaymentOrderReportUseCase } from "./PaymentOrderReportUseCase";
import { MonthlyPaymentReportUseCase } from "./MonthlyPaymentReportUseCase";
import { FindFiltersOptionsUseCase } from "./FindFiltersOptionsUseCase";

class ReportsController {
  async paymentOrderReport(request: Request, response: Response) {
    const filters = request.query;

    const generateReport = new PaymentOrderReportUseCase();

    const report = await generateReport.execute({ filters });

    return response.status(200).json(report);
  }

  async monthlyReport(request: Request, response: Response) {
    const filters = request.query;

    const generateReport = new MonthlyPaymentReportUseCase();

    const report = await generateReport.execute({ filters });

    return response.status(200).json(report);
  }

  async findFilterOptions(request: Request, response: Response) {
    const findFilters = new FindFiltersOptionsUseCase();

    const filters = await findFilters.execute();

    return response.status(200).json(filters);
  }
}

export { ReportsController };
