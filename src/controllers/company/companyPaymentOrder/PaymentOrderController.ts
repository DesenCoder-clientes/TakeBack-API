import { Request, Response } from "express";
import { FindCashbacksUseCase } from "../companyCashback/FindCashbacksUseCase";
import { FindCompanyDataUseCase } from "../companyData/FindCompanyDataUseCase";
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

      const finData = new FindCompanyDataUseCase();
      const findCashbacks = new FindCashbacksUseCase();

      const message = await generatePaymentOrderWithTakebackBalance.execute({
        transactionIDs,
        companyId,
        paymentMethodId,
      });

      const companyData = await finData.execute({
        companyId,
      });

      const transactions = await findCashbacks.execute({
        companyId,
      });

      return response.status(200).json({ message, companyData, transactions });
    } else {
      const generatePaymentOrder = new GeneratePaymentOrderUseCase();

      const finData = new FindCompanyDataUseCase();
      const findCashbacks = new FindCashbacksUseCase();

      const message = await generatePaymentOrder.execute({
        transactionIDs,
        companyId,
        paymentMethodId,
      });

      const companyData = await finData.execute({
        companyId,
      });

      const cashbacks = await findCashbacks.execute({
        companyId,
      });

      return response.status(200).json({ message, companyData, cashbacks });
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
