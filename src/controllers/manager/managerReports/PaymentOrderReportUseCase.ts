import { getRepository } from "typeorm";
import { InternalError } from "../../../config/GenerateErros";
import { Companies } from "../../../models/Company";
import { CompanyStatus } from "../../../models/CompanyStatus";
import { PaymentOrder } from "../../../models/PaymentOrder";
import { PaymentOrderMethods } from "../../../models/PaymentOrderMethods";
import { PaymentOrderStatus } from "../../../models/PaymentOrderStatus";

interface FilterProps {
  companyId?: string;
  statusId?: string;
  startDate?: string;
  endDate?: string;
}

interface Props {
  filters?: FilterProps;
}

class PaymentOrderReportUseCase {
  async execute({ filters }: Props) {
    const query = getRepository(PaymentOrder)
      .createQueryBuilder("paymentOrder")
      .select([
        "paymentOrder.id",
        "paymentOrder.value",
        "method.description",
        "status.description",
        "company.fantasyName",
        "companyStatus.description",
      ])
      .leftJoin(
        PaymentOrderMethods,
        "method",
        "method.id = paymentOrder.paymentMethod"
      )
      .leftJoin(PaymentOrderStatus, "status", "status.id = paymentOrder.status")
      .leftJoin(Companies, "company", "company.id = paymentOrder.company")
      .leftJoin(
        CompanyStatus,
        "companyStatus",
        "companyStatus.id = company.status"
      );

    if (filters.companyId) {
      query.where("company.id = :companyId", { companyId: filters.companyId });
    }

    if (filters.statusId) {
      query.andWhere("status.id = :statusId", { statusId: filters.statusId });
    }

    if (filters.startDate) {
      const date = new Date(filters.startDate);
      date.setDate(date.getDate());

      query.andWhere(`paymentOrder.createdAt >= '${date.toISOString()}'`);
    }

    if (filters.endDate) {
      const date = new Date(filters.endDate);
      date.setDate(date.getDate() + 1);

      query.andWhere(`paymentOrder.createdAt <= '${date.toISOString()}'`);
    }

    const result = await query.getRawMany();

    return result;
  }
}

export { PaymentOrderReportUseCase };
