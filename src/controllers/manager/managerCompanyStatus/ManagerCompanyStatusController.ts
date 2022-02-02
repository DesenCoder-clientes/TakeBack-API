import { Request, Response } from "express";
import { FindCompanyStatusUseCase } from "./FindCompanyStatusUseCase";

class ManagerCompanyStatusController {
  async findCompanyStatus(request: Request, response: Response) {
    const findStatus = new FindCompanyStatusUseCase();

    const result = await findStatus.execute();

    return response.status(200).json(result);
  }
}

export { ManagerCompanyStatusController };
