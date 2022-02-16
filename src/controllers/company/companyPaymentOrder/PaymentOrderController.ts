import { Request, Response } from "express";
import { CancelPaymentOrderUseCase } from "./CancelPaymentOrderUseCase";
import { FindaPaymentMethodUseCase } from "./FindPaymentMethodUseCase";
import { GeneratePaymentOrderUseCase } from "./GeneratePaymentOrderUseCase";
import { GeneratePaymentOrderWithTakebackBalanceUseCase } from "./GeneratePaymentOrderWithTakebackBalanceUseCase";

interface Props {
  transactionIDs: number[];
  paymentMethodId: number;
}

class PaymentOrderController {
  async generate(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { transactionIDs, paymentMethodId }: Props = request.body;

    if (paymentMethodId === 1) {
      const generatePaymentOrderWithTakebackBalance =
        new GeneratePaymentOrderWithTakebackBalanceUseCase();

      const result = await generatePaymentOrderWithTakebackBalance.execute({
        transactionIDs,
        companyId,
        paymentMethodId,
      });

      return response.status(200).json(result);
    } else {
      const generatePaymentOrder = new GeneratePaymentOrderUseCase();

      const result = await generatePaymentOrder.execute({
        transactionIDs,
        companyId,
        paymentMethodId,
      });

      return response.status(200).json(result);
    }
  }

  async cancel(request: Request, response: Response) {
    const orderId = request.params.id;

    const cancelOrder = new CancelPaymentOrderUseCase();

    const result = await cancelOrder.execute({
      orderId: parseInt(orderId),
    });

    return response.status(200).json(result);
  }

  async findPaymentMethod(request: Request, response: Response) {
    const find = new FindaPaymentMethodUseCase();

    const result = await find.execute();

    return response.status(200).json(result);
  }
}

export { PaymentOrderController };
