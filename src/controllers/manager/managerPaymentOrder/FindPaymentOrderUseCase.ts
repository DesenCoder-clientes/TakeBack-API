import { query } from "express";
import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { PaymentMethodOfPaymentOrder } from "../../../models/PaymentMethodOfPaymentOrder";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

interface QueryProps {
  statusId?: string;
  companyId?: string;
}

interface PaginationProps {
  limit: string;
  offset: string;
}

interface Props {
  pagination: PaginationProps;
  filters: QueryProps;
}

class FindPaymentOrderUseCase {
  async execute({ filters, pagination }: Props) {
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
      .addSelect([
        "company.fantasyName",
        "status.description",
        "paymentMethod.description",
      ])
      .leftJoin(Companies, "company", "company.id = order.company")
      .leftJoin(PaymentOrderStatus, "status", "status.id = order.status")
      .leftJoin(
        PaymentMethodOfPaymentOrder,
        "paymentMethod",
        "paymentMethod.id = order.paymentMethod"
      )
      .limit(parseInt(pagination.limit))
      .offset(parseInt(pagination.offset) * parseInt(pagination.limit));

    if (filters.companyId) {
      findOrder.where("company.id = :companyId", {
        companyId: filters.companyId,
      });
    }

    if (filters.statusId) {
      findOrder.andWhere("status.id = :statusId", {
        statusId: filters.statusId,
      });
    }

    const orders = await findOrder.getRawMany();

    return orders;
  }
}

export { FindPaymentOrderUseCase };