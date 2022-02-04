import { Request, Response } from "express";
import { FindConsumerUseCase } from "./FindConsumerUseCase";
import { ListCitiesUseCase } from "./ListCitiesUseCase";
import { ListConsumersUseCase } from "./ListConsumersUseCase";
import { ListConsumersWithSearchUseCase } from "./ListConsumersWithSearchUseCase";

interface QueryProps {
  status?: string;
  city?: string;
}

interface QuerySearchProps {
  searchTerm?: string;
}

class ConsumersController {
  async listConsumer(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const query: QueryProps = request.query;

    const find = new ListConsumersUseCase();

    const result = await find.execute({
      pagination: { limit, offset },
      query,
    });

    return response.status(200).json(result);
  }

  async searchConsumer(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const query: QuerySearchProps = request.query;

    const search = new ListConsumersWithSearchUseCase();

    const result = await search.execute({
      pagination: { limit, offset },
      query,
    });

    return response.status(200).json(result);
  }

  async listCities(request: Request, response: Response) {
    const list = new ListCitiesUseCase();

    const result = await list.execute();

    return response.status(200).json(result);
  }

  async findConsumer(request: Request, response: Response) {
    const { cpf, fullName, deactivedAccount } = request.query;

    const find = new FindConsumerUseCase();

    const result = await find.execute({
      cpf,
      fullName,
      deactivedAccount,
    });

    response.status(200).json(result);
  }
}

export { ConsumersController };
