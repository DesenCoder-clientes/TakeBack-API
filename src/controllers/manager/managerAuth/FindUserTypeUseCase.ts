import { getRepository } from "typeorm";
import { TakeBackUsers } from "../../../models/TakeBackUsers";
import { TakeBackUserTypes } from "../../../models/TakeBackUserTypes";

class FindUserTypeUseCase {
  async execute(userId: string) {
    const user = await getRepository(TakeBackUsers).findOne({
      where: { id: userId },
      relations: ["userType"],
    });

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
