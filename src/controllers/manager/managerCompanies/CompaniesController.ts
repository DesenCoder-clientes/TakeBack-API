import { Request, Response } from "express";
import { AllowCompanyFirstAccessUseCase } from "./AllowCompanyFirstAccessUseCase";
import { RegisterCompanyPaymentMethodsUseCase } from "../../company/companyMethods/RegisterCompanyPaymentMethodsUseCase";

interface Props {
  companyId: string;
  name?: string;
}

class CompaniesController {
  async generateManagerUser(request: Request, response: Response) {
    const { companyId, name }: Props = request.body;

    const registerCompanyMethod = new RegisterCompanyPaymentMethodsUseCase();
    const allowCompanyAccess = new AllowCompanyFirstAccessUseCase();

    const result = await allowCompanyAccess.execute({ companyId, name });
    await registerCompanyMethod.execute({
      companyId,
      paymentId: 1,
      cashbackPercentage: 0,
    });

    response.status(201).json(result);
  }
}

export { CompaniesController };
