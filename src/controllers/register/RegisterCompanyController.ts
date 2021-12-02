import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "./RegisterCompanyUseCase";

class RegisterCompanyController {
  async handle(request: Request, response: Response) {
    const { name } = request.body;

    const registerCompanyUseCase = new RegisterCompanyUseCase();

    const company = await registerCompanyUseCase.execute({ name });

    return response.json(company);
  }
}

export { RegisterCompanyController };
