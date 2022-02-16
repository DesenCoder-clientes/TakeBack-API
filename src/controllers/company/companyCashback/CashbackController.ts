import { Request, Response } from "express";

import { GenerateCashbackUseCase } from "./GenerateCashbackUseCase";
import { GenerateCashbackWithTakebackPaymentMethodUseCase } from "./GenerateCashbackWithTakebackPaymentMethodUseCase";
import { GetConsumerInfoUseCase } from "./GetConsumerInfoUseCase";
import { FindCashbacksUseCase } from "./FindCashbacksUseCase";
import { CancelCashBackUseCase } from "./CancelCashBackUseCase";

interface GenerateCashbackProps {
  code?: string;
  cashbackData: {
    costumer: {
      cpf: string;
      value: string;
    };
    method: [
      {
        method: string;
        value: string;
      }
    ];
  };
}

interface CancelProps {
  transactionIDs: number[];
  cancellationDescription: string;
}

class CashbackController {
  async generateCashback(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];
    const { cashbackData, code }: GenerateCashbackProps = request.body;

    const cashback = new GenerateCashbackUseCase();

    const result = await cashback.execute({
      cashbackData,
      companyId,
      userId,
      code: parseInt(code),
    });

    return response.status(200).json(result);
  }

  async generateCashbackWithTakebackPaymentMethod(
    request: Request,
    response: Response
  ) {
    const { companyId, userId } = request["tokenPayload"];
    const { cashbackData }: GenerateCashbackProps = request.body;
    const code = request.params.code;

    const cashback = new GenerateCashbackWithTakebackPaymentMethodUseCase();

    const result = await cashback.execute({
      cashbackData,
      companyId,
      userId,
      code,
    });

    return response.status(200).json(result);
  }

  async getConsumerInfo(request: Request, response: Response) {
    const cpf = request.params.cpf;

    const consumerInfo = new GetConsumerInfoUseCase();

    const result = await consumerInfo.execute({ cpf });

    return response.status(200).json(result);
  }

  async findCashbacks(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const cashbacks = new FindCashbacksUseCase();

    const result = await cashbacks.execute({ companyId });

    return response.status(200).json(result);
  }

  async cancelCashBack(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { cancellationDescription, transactionIDs }: CancelProps =
      request.body;

    const cancel = new CancelCashBackUseCase();

    const sucess = await cancel.execute({
      cancellationDescription,
      transactionIDs,
    });

    if (sucess) {
      const cashbacks = new FindCashbacksUseCase();

      const result = await cashbacks.execute({ companyId });

      return response.status(200).json(result);
    }
  }
}

export { CashbackController };
