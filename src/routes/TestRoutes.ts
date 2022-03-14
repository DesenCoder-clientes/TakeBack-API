import { Request, Response, Router } from "express";
import { VerifyCashbacksExpired } from "../controllers/manager/managerCompanies/VerifyCashbacksExpired";
import { VerifyCompanyMonthlyPaymentUseCase } from "../controllers/manager/managerCompanies/VerifyCompanyMonthlyPaymentUseCase";

const routes = Router();

routes.get("/verificate-cashbacks", async (req: Request, res: Response) => {
  const verifyPaymentMonthly = new VerifyCompanyMonthlyPaymentUseCase();
  const verifyCashbacksExpired = new VerifyCashbacksExpired();

  const companies = await verifyPaymentMonthly.execute();
  const transactions = await verifyCashbacksExpired.execute();

  return res.json({ transactions });
});

export default routes;
