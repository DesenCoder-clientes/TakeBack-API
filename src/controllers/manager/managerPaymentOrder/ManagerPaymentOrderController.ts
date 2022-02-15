import { Request, Response } from "express";
import { FindPaymentOrderUseCase } from "./FindPaymentOrderUseCase";

class ManagerPaymentOrderController {
  async findOrder(request: Request, response: Response) {
    const find = new FindPaymentOrderUseCase();

    const result = await find.execute();

    response.status(200).json(result);
  }
}

export { ManagerPaymentOrderController };
