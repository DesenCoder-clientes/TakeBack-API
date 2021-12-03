import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../useCases/authCompany/RegisterUserUseCase";

interface Props {
  companyId: string;
}

class AuthorizationCompanyController {
  async authorizeCompany(request: Request, response: Response) {
    return response.status(200);
  }

  async generateManagerUser(request: Request, response: Response) {
    const { companyId }: Props = request.body;

    const registerManagerUser = new RegisterUserUseCase();

    const result = await registerManagerUser.execute({ companyId });

    response.status(201).json(result);
  }
}

export { AuthorizationCompanyController };
