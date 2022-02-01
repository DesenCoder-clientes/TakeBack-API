import { Request, Response } from "express";
import { AllowCompanyFirstAccessUseCase } from "./AllowCompanyFirstAccessUseCase";
import { RegisterCompanyPaymentMethodsUseCase } from "../../company/companyMethods/RegisterCompanyPaymentMethodsUseCase";
import { ListCompanyUseCase } from "./ListCompanyUseCase";
import { FindCompanyUseCase } from "./FindCompanyUseCase";

interface Props {
  companyId: string;
  name?: string;
}

interface CompanyReportProps {
  fantasyName?: string;
  registeredNumber?: string;
  status?: string;
}

class CompaniesController {
  async generateManagerUser(request: Request, response: Response) {
    const { companyId, name }: Props = request.body;

    const registerCompanyMethod = new RegisterCompanyPaymentMethodsUseCase();
    const allowCompanyAccess = new AllowCompanyFirstAccessUseCase();

    const result = await allowCompanyAccess.execute({ companyId, name });
    await registerCompanyMethod.execute({
      companyId,
      paymentId: 1,
      cashbackPercentage: 0,
    });

    response.status(201).json(result);
  }

  async listCompany(request: Request, response: Response) {
    const { offset, limit } = request.params;

    const find = new ListCompanyUseCase();

    const result = await find.execute({
      limit,
      offset,
    });

    response.status(201).json(result);
  }

  async findCompany(request: Request, response: Response) {
    const query: CompanyReportProps = request.query;

    const find = new FindCompanyUseCase();

    const result = await find.execute(query);

    response.status(201).json(result);
  }
}

export { CompaniesController };
