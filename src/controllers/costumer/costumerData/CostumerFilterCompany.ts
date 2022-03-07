import { getRepository } from "typeorm";
import { City } from "../../../models/City";
import { Companies } from "../../../models/Company";
import { CompaniesAddress } from "../../../models/CompanyAddress";

interface FilterProps {
  cityId: string;
}

class CostumerFilterCompany {
  async execute({ cityId }: FilterProps) {
    const query = await getRepository(Companies)
      .createQueryBuilder("companies")
      .select(["company.id", "company.fantasyName", "company.createdAt"])
      .leftJoin(CompaniesAddress, "address", "address.id = company.address")
      .leftJoin(City, "city", "city.id = address.city")
      .orderBy("company.fantasyName", "ASC");

    if (cityId) {
      query.where("city.id = :cityId", { cityId });
    }

    const companies = await query.getRawMany();

    return companies;
  }
}

export { CostumerFilterCompany };
