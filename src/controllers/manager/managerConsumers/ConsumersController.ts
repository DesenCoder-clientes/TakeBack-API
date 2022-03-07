import { Request, Response } from "express";
import { FindConsumersDataUseCase } from "./FindConsumersDataUseCase";
import { ListCitiesUseCase } from "./ListCitiesUseCase";
import { ListConsumersUseCase } from "./ListConsumersUseCase";
import { ListConsumersWithSearchUseCase } from "./ListConsumersWithSearchUseCase";
import { UpdateStatusConsumerUseCase } from "./UpdateStatusConsumerUseCase";

interface QueryProps {
  status?: string;
  city?: string;
}

interface QuerySearchProps {
  searchTerm?: string;
}

interface UpdateStatusProps {
  deactivedAccount: boolean;
}

class ConsumersController {
  async findAllConsumers(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const filters: QueryProps = request.query;

    const find = new ListConsumersUseCase();

    const result = await find.execute({
      pagination: { limit, offset },
      filters,
    });

    return response.status(200).json(result);
  }

  async findOneConsumer(request: Request, response: Response) {
    const consumerId = request.params.id;

    const find = new FindConsumersDataUseCase();

    const consumerData = await find.execute({
      consumerId,
    });

    return response.status(200).json({ consumerData });
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

  async updateConsumerStatus(request: Request, response: Response) {
    const consumerId = request.params.id;
    const { deactivedAccount }: UpdateStatusProps = request.body;

    const update = new UpdateStatusConsumerUseCase();
    const find = new FindConsumersDataUseCase();

    const message = await update.execute({
      consumerId,
      deactivedAccount,
    });

    const consumerData = await find.execute({
      consumerId,
    });

    return response.status(200).json({ message, consumerData });
  }
}

export { ConsumersController };
