import { getRepository } from "typeorm";
import { TakeBackUsers } from "../../../models/TakeBackUsers";

interface Props {
  offset: string;
  limit: string;
  userId: string;
}

class FindUserUseCase {
  async execute({ offset, limit, userId }: Props) {
    const user = await getRepository(TakeBackUsers).findOne({
      where: { id: userId },
      relations: ["userType"],
    });

    if (user.userType.isRoot) {
      const users = await getRepository(TakeBackUsers).find({
        select: [
          "name",
          "cpf",
          "email",
          "isActive",
          "phone",
          "id",
          "userType",
          "createdAt",
        ],
        relations: ["userType"],
        take: parseInt(limit),
        skip: parseInt(offset) * parseInt(limit),
        order: { createdAt: "ASC" },
      });

      return users;
    } else {
      const users = await getRepository(TakeBackUsers).find({
        select: [
          "name",
          "cpf",
          "email",
          "isActive",
          "phone",
          "id",
          "userType",
          "createdAt",
        ],
        where: { userType: { isRoot: false } },
        relations: ["userType"],
        take: parseInt(limit),
        skip: parseInt(offset) * parseInt(limit),
        order: { createdAt: "ASC" },
      });

      return users;
    }
  }
}

export { FindUserUseCase };
