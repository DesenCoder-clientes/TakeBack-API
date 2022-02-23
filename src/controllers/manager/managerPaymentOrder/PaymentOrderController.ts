import { Request, Response } from "express";
import { ApproveOrderUseCase } from "./ApproveOrderUseCase";
import { FindPaymentOrderUseCase } from "./FindPaymentOrderUseCase";

interface FindOrdersQueryProps {
  statusId?: string;
  companyId?: string;
}

class PaymentOrderController {
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

  async approveOrder(request: Request, response: Response) {
    const orderId = request.params.id;

    const approve = new ApproveOrderUseCase();

    const result = await approve.excute({
      orderId: parseInt(orderId),
    });

    response.status(200).json(result);
  }
}

export { PaymentOrderController };
