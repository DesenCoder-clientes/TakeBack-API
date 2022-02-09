import { Request, Response } from "express";
import { AllowCompanyFirstAccessUseCase } from "./AllowCompanyFirstAccessUseCase";
import { RegisterCompanyPaymentMethodsUseCase } from "../../company/companyMethods/RegisterCompanyPaymentMethodsUseCase";
import { ListCompanyUseCase } from "./ListCompanyUseCase";
import { UpdateCompanyUseCase } from "./UpdateCompanyUseCase";
import { FindAllCompaniesUseCase } from "./FindAllCompaniesUseCase";
import { ListCompanyWithSearchUseCase } from "./ListCompanyWithSearchUseCase";
import { FindOneCompanyUseCase } from "./FindOneCompanyUseCase";

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

interface FindCompaniesQueryProps {
  statusId?: string;
  industryId?: string;
  cityId?: string;
}

interface ListCompanyWithSearchQueryProps {
  searchTerm?: string;
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

  async findAllCompanies(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const filters: FindCompaniesQueryProps = request.query;

    const findUseCase = new FindAllCompaniesUseCase();

    const companies = await findUseCase.execute({
      pagination: { limit, offset },
      filters,
    });

    response.status(200).json(companies);
  }

  async findOneCompany(request: Request, response: Response) {
    const companyId = request.params.id;

    const findUseCase = new FindOneCompanyUseCase();

    const company = await findUseCase.execute({
      companyId,
    });

    return response.status(200).json(company);
  }

  async listCompanyWithSearch(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const query: ListCompanyWithSearchQueryProps = request.query;

    const find = new ListCompanyWithSearchUseCase();

    const result = await find.execute({
      pagination: { limit, offset },
      query,
    });

    response.status(200).json(result);
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
