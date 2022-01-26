import { Request, Response } from "express";
import { FindConsumerUseCase } from "./FindConsumerUseCase";
import { ListConsumersUseCase } from "./ListConsumersUseCase";


class ConsumersController {
  async listConsumer(request: Request, response: Response){
    const { offset, limit } = request.params;

    const find = new ListConsumersUseCase();

    const result = await find.execute({
      offset,
      limit
    });

    return response.status(200).json(result);
  }

  async findConsumer(request: Request, response: Response){
    const {cpf, fullName, deactivedAccount} = request.query;

    const find = new FindConsumerUseCase();

    const result = await find.execute({
      cpf,
      fullName,
      deactivedAccount
    });

    response.status(201).json(result)

  }
}

export { ConsumersController };
