import { getRepository } from "typeorm";
import { Consumers } from "../../../models/Consumer";

class ReportConsumerActiveInactiveUseCase {
  async execute() {
    const consumer = await getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select("COUNT(consumer.deactivedAccount)", "total")
      .addSelect(["consumer.deactivedAccount", "consumer.id"])
      .groupBy("consumer.deactivedAccount")
      .groupBy("consumer.id")
      .getRawMany();

    const labels = ["Ativo", "Inativo"];
    const values = [];
    const consumerIds = [];

    var countInative = 0;
    var countActive = 0;

    consumer.map((item) => {
      consumerIds.push(item.id);

      if (item.consumer_deactivedAccount == false) {
        countActive = countActive + 1;
      } else {
        countInative = countInative + 1;
      }
    });

    values.push({ countActive, countInative });

    const consumerStatus = { labels, values };
    return consumerStatus;
  }
}

export { ReportConsumerActiveInactiveUseCase };
