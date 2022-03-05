import { getRepository } from "typeorm";
import { City } from "../../../models/City";

class FindAllCitiesUseCase {
  async execute() {
    const cities = await getRepository(City).find();

    return cities;
  }
}

export { FindAllCitiesUseCase };
