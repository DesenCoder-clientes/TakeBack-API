import { Request, Response } from "express";
import { FindPendingCashbacksUseCase } from "../companyCashback/FindPendingCashbacksUseCase";
import { FindCompanyDataUseCase } from "../companyData/FindCompanyDataUseCase";
import { CancelPaymentOrderUseCase } from "./CancelPaymentOrderUseCase";
import { FindaPaymentMethodUseCase } from "./FindPaymentMethodUseCase";
import { GeneratePaymentOrderUseCase } from "./GeneratePaymentOrderUseCase";
import { GeneratePaymentOrderWithTakebackBalanceUseCase } from "./GeneratePaymentOrderWithTakebackBalanceUseCase";
import { FindPaymentOrderUseCase } from "./FindPaymentOrderUseCase";

interface Props {
  transactionIDs: number[];
  paymentMethodId: number;
}

interface FindOrdersQueryProps {
  statusId?: string;
}

class PaymentOrderController {
  async generate(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { transactionIDs, paymentMethodId }: Props = request.body;

    console.log(`MÉTODO DE PAGAMENTO =>>>>>>>>>>>>>> ${paymentMethodId}`);

    if (paymentMethodId === 1) {
      const generatePaymentOrderWithTakebackBalance =
        new GeneratePaymentOrderWithTakebackBalanceUseCase();

      const finData = new FindCompanyDataUseCase();
      const findCashbacks = new FindPendingCashbacksUseCase();

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
      const findCashbacks = new FindPendingCashbacksUseCase();

      const message = await generatePaymentOrder.execute({
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

  async findOrders(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { offset, limit } = request.params;
    const filters: FindOrdersQueryProps = request.query;

    const findUseCase = new FindPaymentOrderUseCase();

    const orders = await findUseCase.execute({
      companyId,
      pagination: { limit, offset },
      filters,
    });

    response.status(200).json(orders);
  }
}

export { PaymentOrderController };
