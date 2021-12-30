import { Request, Response } from "express";

import { GenerateSeedData } from "./SeedDataUseCase";

class MagicController {
  async generateAllSeeds(request: Request, response: Response) {
    const generateSeeds = new GenerateSeedData();

    const result = await generateSeeds.execute();

    return response.status(200).json({ ok: "ok" });
  }
}

export { MagicController };
