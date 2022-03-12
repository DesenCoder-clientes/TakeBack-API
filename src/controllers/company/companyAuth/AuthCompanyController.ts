import { Request, Response } from "express";

import { RegisterCompanyUseCase } from "./RegisterCompanyUseCase";
import { SignInCompanyUseCase } from "./SignInCompanyUseCase";
import { VerifyTokenUseCase } from "./VerifyTokenUseCase";
import { VerifyCashbacksExpired } from "../companyCashback/VerifyCashbacksExpired";

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

class AuthCompanyController {
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

    const signInCompany = new SignInCompanyUseCase();
    const verifyCashbacksExpired = new VerifyCashbacksExpired();

    const result = await signInCompany.execute({
      password,
      registeredNumber,
      user,
    });

    await verifyCashbacksExpired.execute({
      companyId: result.companyId,
    });

    return response.status(200).json(result);
  }

  async verifyToken(request: Request, response: Response) {
    const token = request.headers.authorization;

    const verifyToken = new VerifyTokenUseCase();

    const result = await verifyToken.execute({ token });

    return response.status(200).json(result);
  }
}

export { AuthCompanyController };
