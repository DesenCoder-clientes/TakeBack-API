import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyUsers } from "../../../models/CompanyUsers";
import { CompanyUserTypes } from "../../../models/CompanyUserTypes";

interface Props {
  companyId: string;
  userId: string;
  userTypeId: string;
  name: string;
  isActive: boolean;
}

class UpdateCompanyUsersUseCase {
  async execute({ companyId, userId, userTypeId, name, isActive }: Props) {
    const company = await getRepository(Companies).findOne(companyId);

    if (!company) {
      throw new InternalError("Empresa não encontrada", 400);
    }

    const userExist = await getRepository(CompanyUsers).findOne(userId);

    if (!userExist) {
      throw new InternalError("Usuário não encontrado", 400);
    }

    const userType = await getRepository(CompanyUserTypes).findOne(userTypeId);

    const user = await getRepository(CompanyUsers).update(userId, {
      name,
      userType,
      isActive,
    });

    if (user.affected !== 1) {
      throw new InternalError("Houve um erro ao atualizar o usuário", 500);
    }

    return `Usuário ${name} alterado com sucesso`;
  }
}

export { UpdateCompanyUsersUseCase };
