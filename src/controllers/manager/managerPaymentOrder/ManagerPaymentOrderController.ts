import { Request, Response } from "express";
import { FindPaymentOrderUseCase } from "./FindPaymentOrderUseCase";

interface FindOrdersQueryProps {
  statusId?: string;
  companyId?: string;
}

class ManagerPaymentOrderController {
  async findOrder(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const filters: FindOrdersQueryProps = request.query;

    const findUseCase = new FindPaymentOrderUseCase();

    const orders = await findUseCase.execute({
      pagination: { limit, offset },
      filters,
    });

    response.status(200).json(orders);
  }
}

export { ManagerPaymentOrderController };
