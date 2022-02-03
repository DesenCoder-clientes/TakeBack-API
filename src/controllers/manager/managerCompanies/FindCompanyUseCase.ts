import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Industries } from "../../../models/Industry";

interface FindCompanyProps {
  status?: string;
  industry?: string;
  city?: string;
}

class FindCompanyUseCase {
  async execute({ status, industry, city }: FindCompanyProps) {
    const industries = await getRepository(Industries).find();

    const industryIds = [];
    industries.map((item) => {
      industryIds.push(item.id);
    });

    if (industry && !industryIds.includes(parseInt(industry))) {
      throw new InternalError("Ramo de atividade não localizado", 404);
    }

    const companies = await getRepository(Companies)
      .createQueryBuilder("co")
      .select([
        "co.registeredNumber",
        "co.fantasyName",
        "co.email",
        "co.phone",
        "co.createdAt",
      ])
      .getRawMany();

    return companies;
  }
}

export { FindCompanyUseCase };
