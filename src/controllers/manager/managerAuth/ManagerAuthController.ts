import { Request, Response } from "express";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { SignInUserUseCase } from "./SignInUserUseCase"; 

interface Props {
  name: string
  cpf: string
  email: string
  password: string
  isActive: true
  isRoot: false
}

interface LoginProps{
  cpf: string
  password: string
}

class ManagerAuthController {
  async generateUser(request: Request, response: Response) {
    const { name, cpf, email, isActive, isRoot }: Props = request.body;

    const registerUser = new RegisterUserUseCase();

    const result = await registerUser.execute({ name, cpf, email, isActive, isRoot });

    response.status(201).json(result);
  }

  async signInUser(request: Request, response: Response){
    const {cpf, password} : Props = request.body;

    const userLogin = new SignInUserUseCase();

    const result = await userLogin.execute({cpf, password});

    response.status(201).json(result);
  }
}

export { ManagerAuthController };
