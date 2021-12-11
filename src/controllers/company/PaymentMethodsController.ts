import { Request, Response } from "express";
import { FindPaymentMethodUseCase } from "../../useCases/paymentMethods/FindPaymentMethodsUseCase";

class PaymentMethodsController {
  async findAllCompanyMethods(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyMethods = new FindPaymentMethodUseCase();

    const result = await findCompanyMethods.findCompanyMethods({ companyId });

    return response.status(200).json(result);
  }
}

export { PaymentMethodsController };
