import { Request, Response } from "express";
import { FindPaymentPlanUseCase } from "./FindPaymentPlanUseCase";
import { RegisterPaymentPlanUseCase } from "./RegisterPaymentPlanUseCase";
import { UpdatePaymentPlanUseCase } from "./UpdatePaymentPlanUseCase";

interface RegisterProps {
  description: string;
  value: number;
}

class PaymentPlanController {
  async register(request: Request, response: Response) {
    const { description, value }: RegisterProps = request.body;

    const register = new RegisterPaymentPlanUseCase();
    const find = new FindPaymentPlanUseCase();

    const message = await register.execute({ description, value });
    const plans = await find.execute();

    return response.status(201).json({ message, plans });
  }

  async findAll(request: Request, response: Response) {
    const find = new FindPaymentPlanUseCase();

    const plans = await find.execute();

    return response.status(200).json(plans);
  }

  async update(request: Request, response: Response) {
    const planId = request.params.id;

    const { description, value } = request.body;

    const update = new UpdatePaymentPlanUseCase();
    const find = new FindPaymentPlanUseCase();

    const message = await update.execute({
      planId: parseInt(planId),
      description,
      value,
    });
    const plans = await find.execute();

    return response.status(200).json({ message, plans });
  }
}

export { PaymentPlanController };
