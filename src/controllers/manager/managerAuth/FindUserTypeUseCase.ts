import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { TakeBackUsers } from "../../../models/TakeBackUsers";
import { TakeBackUserTypes } from "../../../models/TakeBackUserTypes";

class FindUserTypeUseCase {
  async execute(userId: string) {
    const user = await getRepository(TakeBackUsers).findOne({
      where: { id: userId },
      relations: ["userType"],
    });

    if (user.userType.id !== 1 && user.userType.id !== 2) {
      throw new InternalError("Não autorizado", 401);
    }

    if (user.userType.isRoot) {
      const userTypes = await getRepository(TakeBackUserTypes).find();

      return userTypes;
    } else {
      const userTypes = await getRepository(TakeBackUserTypes).find({
        where: { isRoot: false },
      });

      return userTypes;
    }
  }
}

export { FindUserTypeUseCase };
