import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";

class ReportCompanyActiveInactiveUseCase {
  async execute() {
    const company = await getRepository(Companies)
      .createQueryBuilder("company")
      .select("COUNT(status.description)", "total")
      .addSelect(["status.description"])
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .groupBy("status.description")
      .getRawMany();

    const labels = [];
    const values = [];

    company.map((item) => {
      labels.push(item.status_description);
      values.push(parseInt(item.total));
    });

    const companyStatus = { labels, values };

    return companyStatus;
  }
}

export { ReportCompanyActiveInactiveUseCase };
