import { Request, Response } from "express";
import { PaymentOrderReportUseCase } from "./PaymentOrderReportUseCase";

class ReportsController {
  async paymentOrderReport(request: Request, response: Response) {
    const filters = request.query;

    const generateReport = new PaymentOrderReportUseCase();

    const report = await generateReport.execute({ filters });

    return response.status(200).json(report);
  }
}

export { ReportsController };
