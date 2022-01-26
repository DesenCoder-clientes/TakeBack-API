import { Request, Response } from "express";

import { FindCompanyUsersUseCase } from "./FindCompanyUsersUseCase";
import { RegisterCompanyUsersUseCase } from "./RegisterCompanyUsersUseCase";
import { UpdateCompanyUsersUseCase } from "./UpdateCompanyUsersUseCase";

interface RegisterProps {
  name: string;
  password: string;
  userTypeId: string;
}

interface UpdateProps {
  userId: string;
  userTypeId: string;
  name: string;
  isActive: boolean;
}

class CompanyUserController {
  async findCompanyUsers(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyUsers = new FindCompanyUsersUseCase();

    const result = await findCompanyUsers.execute({ companyId });

    return response.status(200).json(result);
  }

  async registerCompanyUser(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { name, password, userTypeId }: RegisterProps = request.body;

    const registerCompanyUser = new RegisterCompanyUsersUseCase();

    const result = await registerCompanyUser.execute({
      companyId,
      name,
      password,
      userTypeId,
    });

    return response.status(200).json(result);
  }

  async updateCompanyUser(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];
    const { isActive, name, userTypeId }: UpdateProps = request.body;
    const { id } = request.params;

    const updateCompanyUser = new UpdateCompanyUsersUseCase();

    const result = await updateCompanyUser.execute({
      companyId,
      isActive,
      name,
      userId: id,
      userTypeId,
    });

    return response.status(200).json(result);
  }
}

export { CompanyUserController };
