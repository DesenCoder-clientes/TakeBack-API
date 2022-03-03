import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { CompanyUsers } from "../../../models/CompanyUsers";

interface Props {
  userName: string;
  newPassword: string;
  companyId: string;
  userId: string;
  userToUpdateId: string;
}

class RootUserUpdateCompanyUserPasswordUseCase {
  async execute({
    companyId,
    newPassword,
    userId,
    userName,
    userToUpdateId,
  }: Props) {
    if (!userName || !newPassword || !userId || !userToUpdateId || !companyId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(CompanyUsers).findOne({
      where: { id: userId, company: companyId },
      relations: ["company"],
    });

    if (!user.isRootUser) {
      throw new InternalError(
        "Você não possui permissão para essa operação",
        400
      );
    }

    const companyUser = await getRepository(CompanyUsers).findOne({
      where: { id: userToUpdateId, company: companyId },
      select: ["id", "name", "password"],
      relations: ["company"],
    });

    if (!companyUser) {
      throw new InternalError("Usuário não encontrado", 404);
    }

    if (companyUser.name !== userName) {
      throw new InternalError("Nome do usuário incorreto", 400);
    }

    const newPasswordEncrypted = bcrypt.hashSync(newPassword, 10);

    const updated = await getRepository(CompanyUsers).update(companyUser.id, {
      password: newPasswordEncrypted,
    });

    if (updated.affected === 0) {
      throw new InternalError("Houve um erro ao atualizar sua senha", 400);
    }

    return "Senha atualizada!";
  }
}

export { RootUserUpdateCompanyUserPasswordUseCase };
