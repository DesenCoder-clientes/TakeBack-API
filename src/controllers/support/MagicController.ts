import { Request, Response } from "express";
import { GenerateTakeBackUserUseCase } from "./GenerateTakeBackUserUseCase";

import { GenerateSeedData } from "./SeedDataUseCase";

interface GenerateTakeBackUserDataProps {
  cpf: string;
  name: string;
  email: string;
  isActive: true;
  phone: string;
  isRoot: boolean;
  userTypeId: string;
}

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

  async generateTakeBackUser(request: Request, response: Response) {
    const data: GenerateTakeBackUserDataProps = request.body;
    const generateUser = new GenerateTakeBackUserUseCase();

    const result = await generateUser.execute(data);

    return response.status(200).json(result);
  }
}

export { MagicController };
