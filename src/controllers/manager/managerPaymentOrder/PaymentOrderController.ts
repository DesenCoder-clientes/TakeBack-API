import { Request, Response } from "express";
import { ApproveOrderUseCase } from "./ApproveOrderUseCase";
import { FindPaymentOrderUseCase } from "./FindPaymentOrderUseCase";
import { FindFilterOptionsToPaymentOrderUseCase } from "./FindFilterOptionsToPaymentOrderUseCase";
import { SendTicketToEmailUseCase } from "./SendTicketToEmailUseCase";
import { UpdatePaymentOrderStatusUseCase } from "./UpdatePaymentOrderStatusUseCase";

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
    const sendTicket = new SendTicketToEmailUseCase();

    if (request.file) {
      const message = await sendTicket.execute({
        fileName: request.file.originalname,
        filePath: request.file.path,
        useCustomEmail: request.body.useCustomEmail,
        customEmail: request.body.customEmail,
      });

      return response.status(200).json(message);
    } else {
      return response.status(200).json("Sem arquivo");
    }
  }

  async updatePaymentOrderStatus(request: Request, response: Response) {
    const orderId = request.params.id;

    const update = new UpdatePaymentOrderStatusUseCase();

    const message = update.execute({ orderId: parseInt(orderId) });

    return response.status(200).json(message);
  }
}

export { PaymentOrderController };
