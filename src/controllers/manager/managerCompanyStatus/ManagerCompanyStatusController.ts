import { Request, Response } from "express";
import { FindaCompanyStatusUseCase } from "./FindCompanyStatusUseCase";

class ManagerCompanyStatusController {
  async findCompanyStatus(request: Request, response: Response) {
    const findIndustries = new FindaCompanyStatusUseCase();

    const result = await findIndustries.execute();

    return response.status(200).json(result);
  }
}

export { ManagerCompanyStatusController };
