import { Request, Response, Router } from "express";
import { VerifyCashbacksExpired } from "../controllers/manager/managerCompanies/VerifyCashbacksExpired";
import { VerifyCompanyMonthlyPaymentUseCase } from "../controllers/manager/managerCompanies/VerifyCompanyMonthlyPaymentUseCase";
import { VerifyProvisionalAccessUseCase } from "../controllers/manager/managerCompanies/VerifyProvisionalAccessUseCase";

const routes = Router();

routes.get("/verificate-cashbacks", async (req: Request, res: Response) => {
  const verifyPaymentMonthly = new VerifyCompanyMonthlyPaymentUseCase();
  const verifyCashbacksExpired = new VerifyCashbacksExpired();
  const VerifyProvionalAccess = new VerifyProvisionalAccessUseCase();

  await verifyPaymentMonthly.execute();
  const transactions = await verifyCashbacksExpired.execute();
  await VerifyProvionalAccess.execute();

  return res.json({ transactions });
});

export default routes;
