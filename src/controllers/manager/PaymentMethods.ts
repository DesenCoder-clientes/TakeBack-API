import { Request, Response } from "express";
import { FindPaymentMethodUseCase } from "../../useCases/paymentMethods/FindPaymentMethodsUseCase";

import { RegisterPaymentMethodUseCase } from "../../useCases/paymentMethods/RegisterPaymentMethodUseCase";

interface RegisterProps {
  description: string;
}

interface FindProps {
  id?: number;
}

class PaymentMethodController {
  async registerPaymentMethod(request: Request, response: Response) {
    const { description }: RegisterProps = request.body;

    const registerPaymentMethodUseCase = new RegisterPaymentMethodUseCase();

    const result = await registerPaymentMethodUseCase.execute({ description });

    return response.status(200).json(result);
  }

  async findOnePaymentMethod(request: Request, response: Response) {
    const { id }: FindProps = request.params;

    const findPaymentMethods = new FindPaymentMethodUseCase();

    const result = await findPaymentMethods.findOne({ id });

    return response.status(200).json(result);
  }

  async findAllPaymentMethods(request: Request, response: Response) {
    const findPaymentMethods = new FindPaymentMethodUseCase();

    const result = await findPaymentMethods.findAll();

    return response.status(200).json(result);
  }
}

export { PaymentMethodController };
