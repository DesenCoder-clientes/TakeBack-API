import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../models/TakeBackUsers";

interface Props {
  offset: string;
  limit: string;
}

class FindUserUseCase {
  async execute({ offset, limit }: Props) {
    const users = await getRepository(TakeBackUsers).find({
      select: ["name", "cpf", "email", "isActive", "phone", "id", "userType"],
      where: { userType: { isRoot: false } },
      relations: ["userType"],
      take: parseInt(limit),
      skip: parseInt(offset) * parseInt(limit),
      order: { name: "ASC" },
    });

    return users;
  }
}

export { FindUserUseCase };
