import { Request, Response } from "express";
import { FindCompanyStatusUseCase } from "./FindCompanyStatusUseCase";
import { UpdadeCompanyStatusUseCase } from "./UpdateCompanyStatusUseCase";
import { FindCompanyDataUseCase } from "../managerCompanies/FindCompanyDataUseCase";

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
    const findCompanyData = new FindCompanyDataUseCase();

    const message = await udpate.execute({
      companyId,
      statusId,
    });

    const company = await findCompanyData.execute({ companyId });

    return response.status(200).json({ message, company });
  }
}

export { ManagerCompanyStatusController };
