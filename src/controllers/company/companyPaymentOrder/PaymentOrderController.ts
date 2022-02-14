import { Request, Response } from "express";
import { GeneratePaymentOrderUseCase } from "./GeneratePaymentOrderUseCase";

interface Props {
  transactionIDs: number[];
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
}

export { PaymentOrderController };
