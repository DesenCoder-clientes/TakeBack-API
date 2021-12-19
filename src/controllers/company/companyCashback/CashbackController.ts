import { Request, Response } from "express";

import { GenerateCashbackUseCase } from "./GenerateCashbackUseCase";
import { GenerateCashbackWithTakebackPaymentMethodUseCase } from "./GenerateCashbackWithTakebackPaymentMethodUseCase";
import { GetConsumerInfoUseCase } from "./GetConsumerInfoUseCase";
import { FindCashbacksUseCase } from "./FindCashbacksUseCase";

interface GenerateCashbackProps {
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

class CashbackController {
  async generateCashback(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];
    const { cashbackData }: GenerateCashbackProps = request.body;

    const cashback = new GenerateCashbackUseCase();

    const result = await cashback.execute({
      cashbackData,
      companyId,
      userId,
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
}

export { CashbackController };
