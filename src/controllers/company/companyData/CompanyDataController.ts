import { Request, Response } from "express";
import { FindCompanyDataUseCase } from "./FindCompanyDataUseCase";

class CompanyDataController {
  async findCompanyData(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyData = new FindCompanyDataUseCase();

    const result = await findCompanyData.execute({ companyId });

    return response.status(200).json(result);
  }
}

export { CompanyDataController };
