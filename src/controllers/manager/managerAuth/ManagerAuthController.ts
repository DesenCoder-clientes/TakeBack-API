import { Request, Response } from "express";
import { FindUserUseCase } from "./FindUserUseCase";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { SignInUserUseCase } from "./SignInUserUseCase"; 
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { VerifyTokenUseCase } from "./VerifyTokenUseCase";

interface Props {
  name: string
  cpf: string
  email: string
  password: string
  isActive: true
  userTypeDesc: string
  phone: string
}

interface UpdateProps{
  name: string
  cpf: string
  email: string
  userTypeDesc: string
  isActive: true
  phone: string
}

interface FindProps{
  name: string
  cpf: string
  email: string
  userTypeDesc: string
  isActive: true
  phone: string
  id: string
}

class ManagerAuthController {
  async generateUser(request: Request, response: Response) {
    const { name, cpf, email, isActive, phone, userTypeDesc }: Props = request.body;

    const registerUser = new RegisterUserUseCase();

    const result = await registerUser.execute({ name, cpf, email, isActive, phone, userTypeDesc });

    response.status(201).json(result);
  }

  async signInUser(request: Request, response: Response){
    const {cpf, password} : Props = request.body;

    const userLogin = new SignInUserUseCase();

    const result = await userLogin.execute({cpf, password});

    response.status(201).json(result);
  }

  //FUNÇÃO PARA ATUALIZAR CADASTRO DO TAKEBACK USER
  async updateUser(request: Request, response: Response){
    const id = request.params.id;
    const {name, cpf, email, isActive, phone, userTypeDesc} : UpdateProps = request.body;

    const update = new UpdateUserUseCase();

    const result = await update.execute({
      name,
      cpf,
      email,
      isActive,
      phone,
      userTypeDesc,
      id
    })

    return response.status(200).json(result);
  }

  async findUser(request: Request, response: Response){
    
    const findUsers = new FindUserUseCase();

    const result = await findUsers.execute();

    return response.status(200).json(result);
  }

  async verifyToken(request: Request, response: Response) {
    const token = request.headers.authorization;

    const verifyToken = new VerifyTokenUseCase();

    const result = await verifyToken.execute({ token });

    return response.status(200).json(result);
  }
}

export { ManagerAuthController };
