import { Request, Response } from "express";

import { GenerateSeedData } from "../../useCases/support/SeedDataUseCase";

class SeedController {
  async generateAllSeeds(request: Request, response: Response) {
    const generateSeeds = new GenerateSeedData();

    const result = await generateSeeds.execute();

    return response.status(200).json(result);
  }
}

export { SeedController };
