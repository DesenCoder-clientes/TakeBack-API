import { Request, Response } from "express";
import { GenerateCashbackUseCase } from "../../useCases/cashback/GenerateCashbackUseCase";

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
  code: string;
}

class CashbackController {
  async generateCashback(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];
    const { cashbackData, code }: GenerateCashbackProps = request.body;

    const cashback = new GenerateCashbackUseCase();

    const result = await cashback.generate({
      cashbackData,
      code,
      companyId,
      userId,
    });

    return response.status(200).json(result);
  }
}

export { CashbackController };
