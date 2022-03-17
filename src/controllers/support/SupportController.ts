import { Request, Response } from "express";

import { GenerateSeedDataUseCase } from "./GenerateSeedDataUseCase";

interface SeedProps {
  cpf: string;
  email: string;
  name: string;
}

class SupportController {
  async generateSeeds(request: Request, response: Response) {
    const req: SeedProps = request.body;
    const generateSeeds = new GenerateSeedDataUseCase();

    const result = await generateSeeds.execute(req);

    return response.status(200).json(result);
  }
}

export { SupportController };
