import { getRepository } from "typeorm";
import { TakeBackUserTypes } from "../../../models/TakeBackUserTypes";

class FindUserTypeUseCase {
  async execute() {
    const userTypes = await getRepository(TakeBackUserTypes).find({
      where: { isRoot: false },
    });

    return userTypes;
  }
}

export { FindUserTypeUseCase };
