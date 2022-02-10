import { Request, response, Response } from "express";
import { FindIndustryUseCase } from "./FindIndustryUseCase";
import { FindIndustryUseCaseNotPaginated } from "./FindIndustryUseCaseNotPaginated";
import { RegisterIndustryUseCase } from "./RegisterIndustryUseCase";
import { UpdateIndustryUseCase } from "./UpdateIndustryUseCase";

interface Props {
  description: string;
  industryFee: number;
}

class ManagerIndustryController {
  async registerIndustry(request: Request, response: Response) {
    const { description, industryFee }: Props = request.body;

    const registerIndustry = new RegisterIndustryUseCase();

    const result = await registerIndustry.execute({ industryFee, description });

    response.status(201).json(result);
  }

  async updateIndustry(request: Request, response: Response) {
    const id = request.params.id;
    const { description, industryFee }: Props = request.body;

    const update = new UpdateIndustryUseCase();

    const result = await update.execute({
      description,
      industryFee,
      id,
    });

    return response.status(200).json(result);
  }

  async findIndustry(request: Request, response: Response) {
    const findIndustries = new FindIndustryUseCase();
    const { offset, limit } = request.params;

    const result = await findIndustries.execute({
      offset,
      limit,
    });

    return response.status(200).json(result);
  }

  async findIndustryNotPaginated(request: Request, response: Response) {
    const findIndustries = new FindIndustryUseCaseNotPaginated();

    const result = await findIndustries.execute();

    return response.status(200).json(result);
  }
}

export { ManagerIndustryController };
