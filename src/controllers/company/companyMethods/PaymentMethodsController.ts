import { Request, Response } from "express";
import { FindCompanyPaymentMethodUseCase } from "./FindCompanyPaymentMethodsUseCase";

class PaymentMethodsController {
  async findCompanyMethods(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyMethods = new FindCompanyPaymentMethodUseCase();

    const result = await findCompanyMethods.execute({ companyId });

    return response.status(200).json(result);
  }
}

export { PaymentMethodsController };
