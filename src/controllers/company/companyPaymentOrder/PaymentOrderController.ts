import { Request, Response } from "express";
import { CancelPaymentOrderUseCase } from "./CancelPaymentOrderUseCase";
import { GeneratePaymentOrderUseCase } from "./GeneratePaymentOrderUseCase";

interface Props {
  transactionIDs: number[];
}

interface CancelProps {
  orderId: number;
}

class PaymentOrderController {
  async generate(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { transactionIDs }: Props = request.body;
    const generatePaymentOrder = new GeneratePaymentOrderUseCase();

    const result = await generatePaymentOrder.execute({
      transactionIDs,
      companyId,
    });

    response.status(200).json(result);
  }

  async cancel(request: Request, response: Response) {
    const { orderId }: CancelProps = request.body;

    const cancelOrder = new CancelPaymentOrderUseCase();

    const result = await cancelOrder.execute({
      orderId,
    });

    response.status(200).json(result);
  }
}

export { PaymentOrderController };
