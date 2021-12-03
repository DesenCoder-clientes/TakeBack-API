import { Request, Response } from "express";
import { RegisterCompanyUseCase } from "../../useCases/authCompany/RegisterCompanyUseCase";

interface RegisterCompanyDataProps {
  corporateName: string;
  fantasyName: string;
  registeredNumber: string;
  phone: string;
  email: string;
  industry: string;
  zipCode: string;
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
}

// const registerUser = new RegisterUserUseCase();

// await registerUser.execute({
//   companyId: newCompany.id,
//   name: "Gerente",
//   type: "Administrador",
//   password: "123456",
// });

export { AuthController };
