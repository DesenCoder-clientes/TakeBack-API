import { Request, Response } from "express";

import { GenerateSeedData } from "./SeedDataUseCase";

interface SeedProps {
  cpf: string;
  email: string;
  name: string;
}

class MagicController {
  async generateAllSeeds(request: Request, response: Response) {
    const req: SeedProps = request.body;
    const generateSeeds = new GenerateSeedData();

    const result = await generateSeeds.execute(req);

    return response.status(200).json(result);
  }
}

export { MagicController };
