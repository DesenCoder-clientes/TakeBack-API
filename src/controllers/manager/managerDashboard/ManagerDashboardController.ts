import { Request, Response } from "express";
import { TotalizerReportUseCase } from "./TotalizerReportUseCase";

class DashboardController {
  async dashboardReport(request: Request, response: Response) {
    const totalizersReport = new TotalizerReportUseCase();

    const totalizers = await totalizersReport.execute();

    return response.status(200).json({ totalizers });
  }
}

export { DashboardController };
