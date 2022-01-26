import { Request, response, Response } from "express";
import { ConfirmDataToForgotPasswordUseCase } from "./ConfirmDataToForgotPasswordUseCase";
import { DesactiveCostumerUseCase } from "./DesactiveCostumerUseCase";
import { forgotPasswordUseCase } from "./ForgotPasswordUseCase";
import { RegisterCostumerUseCase } from "./RegisterCostumerUseCase";
import { SignInCostumerUseCase } from "./SignInCostumerUseCase";
import { UpdateCostumerPasswordUseCase } from "./UpdateCostumerPasswordUseCase";
import { VerifyIfUserAlreadyExistsUseCase } from "./VerifyIfUserAlreadyExistsUseCase";

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

interface ConfirmDataProps {
  cpf: string;
  birthDate: Date;
}

interface ForgotPasswordProps {
  newPassword: string;
  code: string;
}

class CostumerAuthController {
  async signInCostumer(request: Request, response: Response) {
    const { cpf, password }: LoginProps = request.body;

    const signIn = new SignInCostumerUseCase();

    const result = await signIn.execute({
      cpf,
      password,
    });

    return response.status(200).json(result);
  }

  async registerCostumer(request: Request, response: Response) {
    const data: RegisterProps = request.body;
    console.log(request.body);

    const register = new RegisterCostumerUseCase();

    const result = await register.execute(data);

    return response.status(200).json(result);
  }

  async desactiveCostumer(request: Request, response: Response) {
    const consumerID = request["tokenPayload"].id;

    const { password }: CostumerProps = request.body;

    const desactive = new DesactiveCostumerUseCase();

    const result = await desactive.execute({
      consumerID,
      password,
    });

    return response.status(200).json(result);
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

    return response.status(200).json(result);
  }

  async confirmDataToForgotPassword(request: Request, response: Response) {
    const { birthDate, cpf }: ConfirmDataProps = request.body;

    const confirm = new ConfirmDataToForgotPasswordUseCase();

    const result = await confirm.execute({
      birthDate,
      cpf,
    });

    return response.status(200).json(result);
  }

  async forgotPassword(request: Request, response: Response) {
    const consumerID = request.params.id;

    const { newPassword, code }: ForgotPasswordProps = request.body;

    const forgot = new forgotPasswordUseCase();

    const result = await forgot.execute({
      code,
      consumerID,
      newPassword,
    });

    return response.status(200).json(result);
  }

  async verifyIfUserAlreadyExists(request: Request, response: Response) {
    const { cpf } = request.params;

    const verify = new VerifyIfUserAlreadyExistsUseCase();

    const result = await verify.execute({ cpf });

    return response.status(200).json(result);
  }
}

export { CostumerAuthController };
