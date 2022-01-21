import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../models/TakeBackUsers";
import { TakeBackUserTypes } from "../../../models/TakeBackUserTypes";

interface Props {
  name: string;
  cpf: string;
  email: string;
  id: string;
  userTypeId: string;
  isActive: boolean;
  phone: string;
}

class UpdateUserUseCase {
  async execute({ name, cpf, email, isActive, phone, userTypeId, id }: Props) {
    console.log(name, cpf, email, isActive, phone, userTypeId, id);
    if (!cpf || !name || !email || !phone || !userTypeId) {
      throw new InternalError("Dados incompletos", 400);
    }

    const user = await getRepository(TakeBackUsers).findOne(id);

    if (!user) {
      throw new InternalError("Usuário não encontrado", 400);
    }

    const userType = await getRepository(TakeBackUserTypes).findOne(
      parseInt(userTypeId)
    );

    if (!userType) {
      throw new InternalError("Tipo de usuário inexistente", 401);
    }

    const updateUser = await getRepository(TakeBackUsers).update(id, {
      name,
      cpf,
      email,
      phone,
      userType,
      isActive,
    });

    if (updateUser.affected === 0) {
      throw new InternalError("Erro ao atualizar usuário", 500);
    }

    return "Usuário atualizado";
  }
}

export { UpdateUserUseCase };
