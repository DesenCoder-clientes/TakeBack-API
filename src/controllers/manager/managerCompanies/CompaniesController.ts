import { Request, Response } from "express";
import { AllowCompanyFirstAccessUseCase } from "./AllowCompanyFirstAccessUseCase";
import { RegisterCompanyPaymentMethodsUseCase } from "../../company/companyMethods/RegisterCompanyPaymentMethodsUseCase";
import { ListCompanyUseCase } from "./ListCompanyUseCase";
import { FindCompanyUseCase } from "./FindCompanyUseCase";
import { UpdateCompanyUseCase } from "./UpdateCompanyUseCase";
import { ListCompanyWithFilterUseCase } from "./ListCompanyWithFilterUseCase";
import { ListCompanyWithSearchUseCase } from "./ListCompanyWithSearchUseCase";
import { FindCompanyDataUseCase } from "./FindCompanyDataUseCase";

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

interface FindCompanyProps {
  status?: string;
  industry?: string;
  city?: string;
}

interface ListCompanyQueryProps {
  status?: string;
  industry?: string;
  city?: string;
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

  async listCompany(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const query: ListCompanyQueryProps = request.query;

    const find = new ListCompanyWithFilterUseCase();

    const result = await find.execute({
      pagination: { limit, offset },
      query,
    });

    response.status(201).json(result);
  }

  async listCompanyWithSearch(request: Request, response: Response) {
    const { offset, limit } = request.params;
    const query: ListCompanyWithSearchQueryProps = request.query;

    const find = new ListCompanyWithSearchUseCase();

    const result = await find.execute({
      pagination: { limit, offset },
      query,
    });

    response.status(201).json(result);
  }

  async findCompany(request: Request, response: Response) {
    const query: FindCompanyProps = request.query;

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

  async findData(request: Request, response: Response) {
    const companyId = request.params.id;

    const find = new FindCompanyDataUseCase();

    const result = await find.execute({
      companyId,
    });

    return response.status(200).json(result);
  }
}

export { CompaniesController };
