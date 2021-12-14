import { Request, Response } from "express";
import { FindCompanyDataUseCase } from "./FindCompanyDataUseCase";
import { UpdateCompanyDataUseCase } from "./UpdateCompanyDataUseCase";

interface UpdateProps {
  companyId: string;
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  email: string;
  industry: string;
  phone: string;
}

class CompanyDataController {
  async findCompanyData(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const findCompanyData = new FindCompanyDataUseCase();

    const result = await findCompanyData.execute({ companyId });

    return response.status(200).json(result);
  }

  async updateCompanyData(request: Request, response: Response) {
    const { companyId } = request["tokenPayload"];

    const { corporateName, email, fantasyName, industry, phone }: UpdateProps =
      request.body;

    const updateCompany = new UpdateCompanyDataUseCase();

    const result = await updateCompany.execute({
      companyId,
      corporateName,
      email,
      fantasyName,
      industry,
      phone,
    });

    return response.status(200).json(result);
  }
}

export { CompanyDataController };
