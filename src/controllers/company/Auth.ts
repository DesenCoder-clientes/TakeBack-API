import { Request, Response } from "express";
import { Industries } from "../../models/Industry";
import { RegisterCompanyUseCase } from "../../useCases/authCompany/RegisterCompanyUseCase";

interface RegisterCompanyDataProps {
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  category: Industries;
  zipCode: string;
}

class AuthController {
  async registerNewCompany(request: Request, response: Response) {
    const {
      category,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
    }: RegisterCompanyDataProps = request.body;

    const registerCompanyUseCase = new RegisterCompanyUseCase();

    const result = await registerCompanyUseCase.execute({
      category,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
    });

    return response.status(200).json(result);
  }
}

export { AuthController };
