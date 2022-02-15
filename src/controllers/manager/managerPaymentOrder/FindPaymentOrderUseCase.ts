import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

class FindPaymentOrderUseCase {
  async execute() {
    const orderStatus = await getRepository(PaymentOrderStatus).findOne({
      where: { description: "Aguardando" },
    });

    if (!orderStatus) {
      throw new InternalError(
        "Não há ordens de pagamento aguardando aprovação",
        400
      );
    }

    const findOrder = await getRepository(PaymentOrder)
      .createQueryBuilder("order")
      .select(["order.id", "order.value", "order.createdAt"])
      .addSelect(["company.fantasyName", "status.description"])
      .leftJoin(Companies, "company", "company.id = order.company")
      .leftJoin(PaymentOrderStatus, "status", "status.id = order.status")

      .getRawMany();

    return findOrder;
  }
}

export { FindPaymentOrderUseCase };
