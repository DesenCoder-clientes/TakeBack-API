import { Request, Response } from "express";
import { FindCompanyStatusUseCase } from "./FindCompanyStatusUseCase";
import { UpdadeCompanyStatusUseCase } from "./UpdateCompanyStatusUseCase";

interface UpdateProps {
  statusId: number;
}

class ManagerCompanyStatusController {
  async findCompanyStatus(request: Request, response: Response) {
    const findStatus = new FindCompanyStatusUseCase();

    const result = await findStatus.execute();

    return response.status(200).json(result);
  }

  async updateCompanyStatus(request: Request, response: Response) {
    const companyId = request.params.id;
    const { statusId }: UpdateProps = request.body;
    const udpate = new UpdadeCompanyStatusUseCase();

    const result = await udpate.execute({
      companyId,
      statusId,
    });

    return response.status(200).json(result);
  }
}

export { ManagerCompanyStatusController };
