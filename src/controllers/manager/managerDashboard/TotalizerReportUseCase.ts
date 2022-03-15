import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { Consumers } from "../../../models/Consumer";

class TotalizerReportUseCase {
  async execute() {
    const status = await getRepository(CompanyStatus).find({
      where: { generateCashback: true },
    });

    const statusIds = [];
    status.map((item) => {
      statusIds.push(item.id);
    });

    const companies = await getRepository(Companies)
      .createQueryBuilder("company")
      .select("SUM(company.positiveBalance)", "positiveBalance")
      .addSelect("SUM(company.negativeBalance)", "negativeBalance")
      .addSelect("COUNT(company.id)", "length")
      .leftJoin(CompanyStatus, "status", "status.id = company.status")
      .where("status.id IN (:...statusIds)", { statusIds: [...statusIds] })
      .getRawOne();

    const consumers = await getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select("SUM(consumer.balance)", "totalBalance")
      .addSelect("SUM(consumer.blockedBalance)", "totalBlockedBalance")
      .addSelect("COUNT(consumer.id)", "length")
      .where("consumer.deactivedAccount = :deactived", { deactived: false })
      .getRawOne();

    const labels = ["Empresas", "Clientes"];
    const values = [parseFloat(companies.length), parseFloat(consumers.length)];

    const companieAndConsumers = {
      labels,
      values,
    };

    return {
      balanceOfCompanies: companies,
      balanceOfConsumers: consumers,
      companieAndConsumers,
    };
  }
}

export { TotalizerReportUseCase };
