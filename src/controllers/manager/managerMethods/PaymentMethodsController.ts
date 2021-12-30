import { Request, Response } from "express";

import { RegisterPaymentMethodUseCase } from "./RegisterPaymentMethodUseCase";

interface RegisterProps {
  description: string;
}

class PaymentMethodController {
  async registerPaymentMethod(request: Request, response: Response) {
    const { description }: RegisterProps = request.body;

    const registerPaymentMethodUseCase = new RegisterPaymentMethodUseCase();

    const result = await registerPaymentMethodUseCase.execute({ description });

    return response.status(200).json(result);
  }
}

export { PaymentMethodController };
