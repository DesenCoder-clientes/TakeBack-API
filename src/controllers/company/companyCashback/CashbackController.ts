import { Request, Response } from "express";

import { GenerateCashbackUseCase } from "./GenerateCashbackUseCase";
import { GetConsumerInfoUseCase } from "./GetConsumerInfoUseCase";
import { CancelCashBackUseCase } from "./CancelCashBackUseCase";
import { FindPendingCashbacksUseCase } from "./FindPendingCashbacksUseCase";
import { FindCashbackStatusUseCase } from "./FindCashbackStatusUseCase";
import { FindCashbackTypesUseCase } from "./FindCashbackTypesUseCase";
import { FindAllCashbacksUseCase } from "./FindAllCashbacksUseCase";
import { FindCashbackFiltersUseCase } from "./FindCashbackFiltersUseCase";
import { ValidateUserPasswordUseCase } from "./ValidateUserPasswordUseCase";

interface GenerateCashbackProps {
  code?: string;
  userPassword: string;
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
  async validateUserPasswordToGenerateCashback(
    request: Request,
    response: Response
  ) {
    const { companyId, userId } = request["tokenPayload"];
    const { password } = request.body;

    const verify = new ValidateUserPasswordUseCase();

    const result = await verify.execute({ companyId, password, userId });

    return response.status(200).json(result);
  }

  async generateCashback(request: Request, response: Response) {
    const { companyId, userId } = request["tokenPayload"];
    const { cashbackData, code, userPassword }: GenerateCashbackProps =
      request.body;

    const cashback = new GenerateCashbackUseCase();

    const result = await cashback.execute({
      cashbackData,
      companyId,
      userId,
      userPassword,
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

  async findCashbackFilters(request: Request, response: Response) {
    const find = new FindCashbackFiltersUseCase();

    const status = await find.execute();

    return response.status(200).json(status);
  }

  async findPendingCashbacks(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCashbacks = new FindPendingCashbacksUseCase();

    const cashbacks = await findCashbacks.execute({ companyId });

    return response.status(200).json(cashbacks);
  }

  async findAllCashbacks(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const filters = request.query;
    const { offset, limit } = request.params;

    const findCashbacks = new FindAllCashbacksUseCase();
    const findStatus = new FindCashbackStatusUseCase();
    const findTypes = new FindCashbackTypesUseCase();

    const cashbacks = await findCashbacks.execute({
      companyId,
      filters,
      offset,
      limit,
    });
    const status = await findStatus.execute();
    const types = await findTypes.execute();

    return response.status(200).json({ cashbacks, status, types });
  }

  async cancelCashBack(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { cancellationDescription, transactionIDs }: CancelProps =
      request.body;

    const cancel = new CancelCashBackUseCase();

    const sucess = await cancel.execute({
      cancellationDescription,
      transactionIDs,
      companyId,
    });

    if (sucess) {
      const cashbacks = new FindPendingCashbacksUseCase();

      const result = await cashbacks.execute({ companyId });

      return response.status(200).json(result);
    }
  }
}

export { CashbackController };
