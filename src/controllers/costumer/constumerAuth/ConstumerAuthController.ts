import { Request, Response } from "express";
import { RegisterCostumerUseCase } from "./RegisterCostumerUseCase";
import { SignInCostumerUseCase } from "./SignInCostumerUseCase";

interface LoginProps {
  cpf: string;
  password: string;
}

interface RegisterProps {
  fullName: string;
  cpf: string;
  birthDate: Date;
  email: string;
  phone: string;
  zipCode: string;
  password: string;
}

class CostumerAuthController {
  async signInCostumer(request: Request, response: Response) {
    const { cpf, password }: LoginProps = request.body;

    const signIn = new SignInCostumerUseCase();

    const result = await signIn.execute({
      cpf,
      password,
    });

    response.status(201).json(result);
  }

  async registerCostumer(request: Request, response: Response) {
    const data: RegisterProps = request.body;

    const register = new RegisterCostumerUseCase();

    const result = await register.execute(data);

    response.status(201).json(result);
  }
}

export { CostumerAuthController };
