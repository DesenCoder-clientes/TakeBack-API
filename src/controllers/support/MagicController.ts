import { Request, Response } from "express";
import { GenerateTakeBackUserUseCase } from "./GenerateTakeBackUserUseCase";

import { GenerateSeedData } from "./SeedDataUseCase";

interface GenerateTakeBackUserDataProps {
  cpf: string;
  name: string;
  email: string;
  isActive: true;
  phone: string
  isRoot: boolean;
  userTypeDesc: string;
}

class MagicController {
  async generateAllSeeds(request: Request, response: Response) {
    const generateSeeds = new GenerateSeedData();

    const result = await generateSeeds.execute();

    return response.status(200).json(result);
  }

  async generateTakeBackUser(request: Request, response: Response){
    const data: GenerateTakeBackUserDataProps = request.body;
    const generateUser = new GenerateTakeBackUserUseCase();

    const result = await generateUser.execute(data)

    return response.status(200).json(result);
  }
}

export { MagicController };
