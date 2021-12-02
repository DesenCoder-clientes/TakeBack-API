import { InternalError } from "../../config/GenerateErros";

interface Props {
  name: string;
}

class RegisterCompanyUseCase {
  async execute({ name }: Props) {
    if (!name) {
      throw new InternalError("Informe o nome", 404, "Dados incompletos");
    }

    return name;
  }
}

export { RegisterCompanyUseCase };
