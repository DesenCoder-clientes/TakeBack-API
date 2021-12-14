import { Request, Response } from "express";

import { FindCompanyUsersUseCase } from "../../useCases/companyUsers/FindCompanyUsersUseCase";
import { RegisterCompanyUsersUseCase } from "../../useCases/companyUsers/RegisterCompanyUsersUseCase";
import { UpdateCompanyUsersUseCase } from "../../useCases/companyUsers/UpdateCompanyUsersUseCase";

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

    const result = await findCompanyUsers.find({ companyId });

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
    const { isActive, name, userId, userTypeId }: UpdateProps = request.body;

    const updateCompanyUser = new UpdateCompanyUsersUseCase();

    const result = await updateCompanyUser.execute({
      companyId,
      isActive,
      name,
      userId,
      userTypeId,
    });

    return response.status(200).json(result);
  }
}

export { CompanyUserController };
