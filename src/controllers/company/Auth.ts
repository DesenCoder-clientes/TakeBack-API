import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "../../useCases/authCompany/RegisterCompanyUseCase";
import { SignInCompany } from "../../useCases/authCompany/SignInCompany";

interface RegisterCompanyDataProps {
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  industry: string;
  zipCode: string;
}

interface LoginProps {
  registeredNumber: string;
  user: string;
  password: string;
}

class AuthController {
  async registerNewCompany(request: Request, response: Response) {
    const {
      industry,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
    }: RegisterCompanyDataProps = request.body;

    const registerCompanyUseCase = new RegisterCompanyUseCase();

    const result = await registerCompanyUseCase.execute({
      industry,
      corporateName,
      email,
      fantasyName,
      phone,
      registeredNumber,
      zipCode,
    });

    return response.status(200).json(result);
  }

  async signUserCompany(request: Request, response: Response) {
    const { password, registeredNumber, user }: LoginProps = request.body;

    const signInCompany = new SignInCompany();

    const result = await signInCompany.signIn({
      password,
      registeredNumber,
      user,
    });

    return response.status(200).json(result);
  }
}

export { AuthController };
