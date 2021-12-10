import { Request, Response } from "express";

import { FindDashboardDataToCompaniesUseCase } from "../../useCases/findDashboardData/findDashboardDataToCompaniesUseCase";

class DashboardController {
  async findDataToDashboard(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];

    const findDashboardData = new FindDashboardDataToCompaniesUseCase();

    const result = await findDashboardData.find({ companyId, userId });

    return response.status(200).json(result);
  }
}

export { DashboardController };
