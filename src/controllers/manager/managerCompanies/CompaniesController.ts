import { Request, Response } from "express";
import { AllowCompanyFirstAccessUseCase } from "./AllowCompanyFirstAccessUseCase";
import { RegisterCompanyPaymentMethodsUseCase } from "../../company/companyMethods/RegisterCompanyPaymentMethodsUseCase";
import { ListCompanyUseCase } from "./ListCompanyUseCase";
import { FindCompanyUseCase } from "./FindCompanyUseCase";
import { UpdateCompanyUseCase } from "./UpdateCompanyUseCase";

interface Props {
  companyId: string;
  name?: string;
}

interface UpdateProps {
  email: string;
  industryId: string;
  statusId: string;
  limit: string;
  offset: string;
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

  async updateCompany(request: Request, response: Response) {
    const { email, industryId, statusId, limit, offset }: UpdateProps =
      request.body;
    const { id } = request["tokenPayload"];
    const companyId = request.params.id;

    const update = new UpdateCompanyUseCase();
    const find = new ListCompanyUseCase();

    const message = await update.execute({
      email,
      statusId,
      industryId,
      id,
      companyId,
    });

    const companies = await find.execute({
      limit,
      offset,
    });

    response.status(200).json({ message, companies });
  }
}

export { CompaniesController };
