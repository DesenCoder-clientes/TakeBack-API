import { Request, Response } from "express";

import { FindIndustriesUseCase } from "../../useCases/public/FindIndustriesUseCase";

class FindAllIndustriesController {
  async find(request: Request, response: Response) {
    const findIndustries = new FindIndustriesUseCase();

    const result = await findIndustries.execute();

    return response.status(200).json(result);
  }
}

export { FindAllIndustriesController };
