import { Request, Response } from "express";
import { FindUserTypeUseCase } from "./FindUserTypeUseCase";
import { FindUserUseCase } from "./FindUserUseCase";
import { RegisterUserUseCase } from "./RegisterUserUseCase";
import { SignInUserUseCase } from "./SignInUserUseCase";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { VerifyTokenUseCase } from "./VerifyTokenUseCase";
import { UpdateUserPasswordUseCase } from "./UpdateUserPasswordUseCase";

interface Props {
  name: string;
  cpf: string;
  email: string;
  password: string;
  isActive: true;
  userTypeId: string;
  phone: string;
}

interface UpdateProps {
  name: string;
  cpf: string;
  email: string;
  userTypeId: string;
  isActive: boolean;
  phone: string;
}

interface UpdatePasswordProps {
  password: string;
  newPassword: string;
}

class ManagerAuthController {
  async registerUser(request: Request, response: Response) {
    const { name, cpf, email, isActive, phone, userTypeId }: Props =
      request.body;

    const registerUser = new RegisterUserUseCase();
    const find = new FindUserUseCase();

    const message = await registerUser.execute({
      name,
      cpf,
      email,
      isActive,
      phone,
      userTypeId,
    });

    const users = await find.execute({
      limit: "12",
      offset: "0",
    });

    response.status(201).json({ message, users });
  }

  async signInUser(request: Request, response: Response) {
    const { cpf, password }: Props = request.body;

    const userLogin = new SignInUserUseCase();

    const result = await userLogin.execute({ cpf, password });

    response.status(201).json(result);
  }

  //FUNÇÃO PARA ATUALIZAR CADASTRO DO TAKEBACK USER
  async updateUser(request: Request, response: Response) {
    const id = request.params.id;
    const { name, cpf, email, isActive, phone, userTypeId }: UpdateProps =
      request.body;

    const update = new UpdateUserUseCase();
    const find = new FindUserUseCase();

    const message = await update.execute({
      name,
      cpf,
      email,
      isActive,
      phone,
      userTypeId,
      id,
    });

    const users = await find.execute({
      limit: "12",
      offset: "0",
    });

    return response.status(200).json({ message, users });
  }

  async findUser(request: Request, response: Response) {
    const { offset, limit } = request.params;

    const findUsers = new FindUserUseCase();

    const result = await findUsers.execute({
      offset,
      limit,
    });

    return response.status(200).json(result);
  }

  async verifyToken(request: Request, response: Response) {
    const token = request.headers.authorization;

    const verifyToken = new VerifyTokenUseCase();

    const result = await verifyToken.execute({ token });

    return response.status(200).json(result);
  }

  async findUserType(request: Request, response: Response) {
    const findUserTypes = new FindUserTypeUseCase();

    const result = await findUserTypes.execute();

    return response.status(200).json(result);
  }

  async updateUserPassword(request: Request, response: Response) {
    const { id } = request["tokenPayload"];
    const { newPassword, password }: UpdatePasswordProps = request.body;

    const update = new UpdateUserPasswordUseCase();

    const result = await update.execute({ newPassword, password, userId: id });

    return response.status(200).json(result);
  }
}

export { ManagerAuthController };
