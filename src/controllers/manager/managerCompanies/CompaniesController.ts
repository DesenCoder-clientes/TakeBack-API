import { Request, Response } from "express";
import { AllowCompanyFirstAccessUseCase } from "./AllowCompanyFirstAccessUseCase";
import { RegisterCompanyTakebackPaymentMethodsUseCase } from "./RegisterCompanyTakebackPaymentMethodsUseCase";
import { ListCompanyUseCase } from "./ListCompanyUseCase";
import { UpdateCompanyUseCase } from "./UpdateCompanyUseCase";
import { FindAllCompaniesUseCase } from "./FindAllCompaniesUseCase";
import { ListCompanyWithSearchUseCase } from "./ListCompanyWithSearchUseCase";
import { FindOneCompanyUseCase } from "./FindOneCompanyUseCase";
import { FindCompanyUsersUseCase } from "./FindCompanyUsersUseCase";
import { UpdateCustomFeeUseCase } from "./UpdateCustomFeeUseCase";

interface Props {
  companyId: string;
  useCustomName?: boolean;
  customName?: string;
  useCustomFee?: boolean;
  customFee?: number;
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

interface UpdateCustomFeeProps {
  customIndustryFee: number;
  customIndustryFeeActive: boolean;
}

class CompaniesController {
  async allowFirstAccess(request: Request, response: Response) {
    const data: Props = request.body;

    const findUseCase = new FindOneCompanyUseCase();
    const findUser = new FindCompanyUsersUseCase();
    const registerTakebackMethod =
      new RegisterCompanyTakebackPaymentMethodsUseCase();
    const allowCompanyAccess = new AllowCompanyFirstAccessUseCase();

    const message = await allowCompanyAccess.execute(data);
    await registerTakebackMethod.execute({
      companyId: data.companyId,
    });
    const companyData = await findUseCase.execute({
      companyId: data.companyId,
    });
    const companyUsers = await findUser.execute({ companyId: data.companyId });

    response.status(200).json({ message, companyData, companyUsers });
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
    const findUser = new FindCompanyUsersUseCase();

    const company = await findUseCase.execute({
      companyId,
    });

    const users = await findUser.execute({
      companyId,
    });

    return response.status(200).json({ company, users });
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

  async updateCustomFee(request: Request, response: Response) {
    const { customIndustryFee, customIndustryFeeActive }: UpdateCustomFeeProps =
      request.body;
    const companyId = request.params.id;

    const update = new UpdateCustomFeeUseCase();
    const findUseCase = new FindOneCompanyUseCase();

    const message = await update.execute({
      companyId,
      customIndustryFee,
      customIndustryFeeActive,
    });

    const companyData = await findUseCase.execute({ companyId });

    response.status(200).json({ message, companyData });
  }
}

export { CompaniesController };
