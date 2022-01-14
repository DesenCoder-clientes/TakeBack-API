import { Request, Response } from "express";
import { DesactiveCostumerUseCase } from "./DesactiveCostumerUseCase";
import { RegisterCostumerUseCase } from "./RegisterCostumerUseCase";
import { SignInCostumerUseCase } from "./SignInCostumerUseCase";
import { UpdateCostumerPasswordUseCase } from "./UpdateCostumerPasswordUseCase";

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

interface ConsumerRequestToUpdatePassword {
  password: string;
  newPassword: string;
}

interface CostumerProps {
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

  async desactiveCostumer(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { password }: CostumerProps = request.body;

    const desactive = new DesactiveCostumerUseCase();

    const result = await desactive.execute({
      consumerID,
      password,
    });

    response.status(201).json(result);
  }

  async updateCostumerPassword(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { newPassword, password }: ConsumerRequestToUpdatePassword =
      request.body;

    const update = new UpdateCostumerPasswordUseCase();

    const result = await update.execute({
      consumerID,
      newPassword,
      password,
    });

    response.status(201).json(result);
  }
}

export { CostumerAuthController };
