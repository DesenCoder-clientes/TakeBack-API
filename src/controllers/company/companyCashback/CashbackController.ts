import { Request, Response } from "express";
import { GenerateCashbackUseCase } from "./GenerateCashbackUseCase";
import { GenerateCashbackWithTakebackPaymentMethodUseCase } from "./GenerateCashbackWithTakebackPaymentMethodUseCase";

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
}

export { CashbackController };
