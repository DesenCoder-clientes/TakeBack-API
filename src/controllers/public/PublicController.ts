import { Request, Response } from "express";

import { FindIndustriesUseCase } from "./FindIndustriesUseCase";

class PublicController {
  async findIndustries(request: Request, response: Response) {
    const findIndustries = new FindIndustriesUseCase();

    const result = await findIndustries.execute();

    return response.status(200).json(result);
  }
}

export { PublicController };
