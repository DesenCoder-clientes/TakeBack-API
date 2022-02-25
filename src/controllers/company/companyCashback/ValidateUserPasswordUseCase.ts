import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyUsers } from "../../../models/CompanyUsers";

interface Props {
  companyId: string;
  userId: string;
  password: string;
}

class ValidateUserPasswordUseCase {
  async execute({ companyId, userId, password }: Props) {
    if (!userId || !password) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(CompanyUsers).findOne({
      where: { id: userId, company: { id: companyId } },
      select: ["id", "password", "company"],
    });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new InternalError("Erro ao validar a senha", 400);
    }

    return { message: true };
  }
}

export { ValidateUserPasswordUseCase };
