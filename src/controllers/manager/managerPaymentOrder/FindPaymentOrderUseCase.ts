import { getRepository } from "typeorm";
import { Companies } from "../../../models/Company";
import { PaymentOrderMethods } from "../../../models/PaymentOrderMethods";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

interface QueryProps {
  statusId?: string;
  paymentMethodId?: string;
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
    const query = getRepository(PaymentOrder)
      .createQueryBuilder("order")
      .select([
        "order.id",
        "order.value",
        "order.createdAt",
        "order.approvedAt",
        "order.ticketName",
        "order.ticketPath",
        "order.pixKey",
      ])
      .addSelect([
        "company.id",
        "company.fantasyName",
        "company.email",
        "status.description",
        "paymentMethod.id",
        "paymentMethod.description",
      ])
      .leftJoin(Companies, "company", "company.id = order.company")
      .leftJoin(PaymentOrderStatus, "status", "status.id = order.status")
      .leftJoin(
        PaymentOrderMethods,
        "paymentMethod",
        "paymentMethod.id = order.paymentMethod"
      )
      .orderBy("order.id", "DESC")
      .limit(parseInt(pagination.limit))
      .offset(parseInt(pagination.offset) * parseInt(pagination.limit));

    if (filters.statusId) {
      query.andWhere("status.id = :statusId", {
        statusId: parseInt(filters.statusId),
      });
    }

    if (filters.paymentMethodId) {
      query.andWhere("paymentMethod.id = :paymentMethodId", {
        paymentMethodId: parseInt(filters.paymentMethodId),
      });
    }

    const orders = await query.getRawMany();

    return orders;
  }
}

export { FindPaymentOrderUseCase };
