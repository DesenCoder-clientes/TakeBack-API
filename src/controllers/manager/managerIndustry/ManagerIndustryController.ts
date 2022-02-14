import { Request, response, Response } from "express";
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
    const industries = new FindIndustryUseCaseNotPaginated();

    const message = await update.execute({
      description,
      industryFee,
      id,
    });

    return response.status(200).json({ message, industries });
  }

  async findAllIndustries(request: Request, response: Response) {
    const findIndustries = new FindIndustryUseCaseNotPaginated();

    const result = await findIndustries.execute();

    return response.status(200).json(result);
  }
}

export { ManagerIndustryController };
