import { Request, Response } from "express";
import { ReportCashbackPerPaymentMethodUseCase } from "./ReportCashbackPerPaymentMethodUseCase";
import { ReportCompanyActiveInactiveUseCase } from "./ReportCompanyActiveInactiveUseCase";
import { ReportConsumerActiveInactiveUseCase } from "./ReportConsumerActiveInactiveUseCase";
import { ReportTotalRevenuesUseCase } from "./ReportTotalRevenuesUseCase";
import { ReportTotalPayableUseCase } from "./ReportTotalPayableUseCase";
import { ReportTotalReceivableUseCase } from "./ReportTotalReceivableUseCase";

class DashboardController {
  async reportConsumer(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const consumerReport = new ReportConsumerActiveInactiveUseCase();

    const result = await consumerReport.execute({
      id,
    });

    response.status(200).json(result);
  }

  async reportCompany(request: Request, response: Response) {
    const companyReport = new ReportCompanyActiveInactiveUseCase();

    const result = await companyReport.execute();

    response.status(200).json(result);
  }

  async totalReceivable(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const totalReceivableReport = new ReportTotalReceivableUseCase();

    const result = await totalReceivableReport.execute({
      id,
    });

    response.status(200).json(result);
  }

  async totalPayable(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const totalPayableReport = new ReportTotalPayableUseCase();

    const result = await totalPayableReport.execute({
      id,
    });

    response.status(200).json(result);
  }

  async totalRevenues(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const revenuesReport = new ReportTotalRevenuesUseCase();

    const result = await revenuesReport.execute({
      id,
    });

    response.status(200).json(result);
  }

  async cashbackPerPaymentMethod(request: Request, response: Response) {
    const { id } = request["tokenPayload"];

    const cashbackReport = new ReportCashbackPerPaymentMethodUseCase();

    const result = await cashbackReport.execute({
      id,
    });

    response.status(200).json(result);
  }
}

export { DashboardController };
