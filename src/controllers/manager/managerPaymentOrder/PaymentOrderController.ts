import { Request, Response } from "express";
import { ApproveOrderUseCase } from "./ApproveOrderUseCase";
import { FindPaymentOrderUseCase } from "./FindPaymentOrderUseCase";
import { FindFilterOptionsToPaymentOrderUseCase } from "./FindFilterOptionsToPaymentOrderUseCase";
import { SendPaymentInfoToEmailUseCase } from "./SendPaymentInfoToEmailUseCase";

interface FindOrdersQueryProps {
  statusId?: string;
  paymentMethodId?: string;
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

    return response.status(200).json(orders);
  }

  async findFilterOptions(request: Request, response: Response) {
    const find = new FindFilterOptionsToPaymentOrderUseCase();

    const filters = await find.execute();

    return response.status(200).json(filters);
  }

  async approveOrder(request: Request, response: Response) {
    const orderId = request.params.id;

    const approve = new ApproveOrderUseCase();

    const result = await approve.excute({
      orderId: parseInt(orderId),
    });

    return response.status(200).json(result);
  }

  async sendPaymentInfoToEmail(request: Request, response: Response) {
    console.log(request);

    return response.status(200).json("ok");
    // const sendMail = new SendPaymentInfoToEmailUseCase()
  }
}

export { PaymentOrderController };
