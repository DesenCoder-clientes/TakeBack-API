import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyUsers } from "../../../models/CompanyUsers";

interface Props {
  password: string;
  newPassword: string;
  companyId: string;
  userId: string;
}

class UpdateCompanyPasswordUseCase {
  async execute({ companyId, newPassword, password, userId }: Props) {
    if (!password || !newPassword) {
      throw new InternalError("Dados incompletos", 400);
    }

    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { id: userId },
      select: ["id", "password"],
    });

    const passwordMatch = await bcrypt.compare(password, companyUser.password);

    if (!passwordMatch) {
      throw new InternalError("Senha incorreta", 400);
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    const updated = await getRepository(CompanyUsers).update(userId, {
      password: newPasswordEncrypted,
    });

    if (updated.affected === 0) {
      throw new InternalError("Houve um erro ao atualizar sua senha", 400);
    }

    return "Senha atualizada!";
  }
}

export { UpdateCompanyPasswordUseCase };
