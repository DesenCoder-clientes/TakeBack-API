import { Request, Response } from "express";
import { FindAppDataUseCase } from "./FindAppDataUseCase";

import { FindDashboardReportsUseCase } from "./FindDashboardReportsUseCase";

class ReportsController {
  async dashboardReports(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];

    const dashboardReports = new FindDashboardReportsUseCase();

    const result = await dashboardReports.execute({ companyId, userId });

    return response.status(200).json(result);
  }

  async findAppData(request: Request, response: Response) {
    const { userId } = request["tokenPayload"];

    const appData = new FindAppDataUseCase();

    const result = await appData.execute({ userId });

    return response.status(200).json(result);
  }
}

export { ReportsController };
