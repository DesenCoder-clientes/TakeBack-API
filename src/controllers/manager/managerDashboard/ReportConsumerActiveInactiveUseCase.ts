import { getRepository } from "typeorm";
import { Consumers } from "../../../models/Consumer";

class ReportConsumerActiveInactiveUseCase {
  async execute() {
    const consumer = await getRepository(Consumers)
      .createQueryBuilder("consumer")
      .select(["consumer.deactivedAccount", "consumer.id"])
      .groupBy("consumer.deactivedAccount")
      .groupBy("consumer.id")
      .getRawMany();

    const labels = ["Ativo", "Inativo"];
    const values = [];

    var countInative = 0;
    var countActive = 0;

    consumer.map((item) => {
      if (item.consumer_deactivedAccount) {
        countInative = countInative + 1;
      } else {
        countActive = countActive + 1;
      }
    });

    values.push(countActive, countInative);

    const consumerStatus = { labels, values };
    return consumerStatus;
  }
}

export { ReportConsumerActiveInactiveUseCase };
