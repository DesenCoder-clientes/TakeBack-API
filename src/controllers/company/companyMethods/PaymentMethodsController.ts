import { Request, Response } from "express";

import { FindCompanyPaymentMethodsUseCase } from "./FindCompanyPaymentMethodsUseCase";
import { FindCompanyPaymentMethodsForCashierUseCase } from "./FindCompanyPaymentMethodsForCashierUseCase";
import { UpdateCompanyPaymentMethodsUseCase } from "./UpdateCompanyPaymentMethodsUseCase";

interface UpdateProps {
  paymentId: number;
  cashbackPercentage: number;
  isActive: boolean;
}

class PaymentMethodsController {
  async findCompanyMethods(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyMethods = new FindCompanyPaymentMethodsUseCase();

    const result = await findCompanyMethods.execute({ companyId });

    return response.status(200).json(result);
  }

  async findCompanyMethodsForCashier(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyMethods = new FindCompanyPaymentMethodsForCashierUseCase();

    const result = await findCompanyMethods.execute({ companyId });

    return response.status(200).json(result);
  }

  async updateCompanyMethod(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { cashbackPercentage, isActive, paymentId }: UpdateProps =
      request.body;

    const updateCompanyMethod = new UpdateCompanyPaymentMethodsUseCase();

    const result = await updateCompanyMethod.execute({
      cashbackPercentage,
      companyId,
      isActive,
      paymentId,
    });

    return response.status(200).json(result);
  }
}

export { PaymentMethodsController };
