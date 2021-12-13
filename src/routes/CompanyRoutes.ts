import { Router } from "express";

import * as Data from "../controllers/company/AppDataController";

import { AuthMiddleware } from "../middlewares/companyMiddlewares/AuthMiddleware";

import { AuthController } from "../controllers/company/AuthController";
import { DashboardController } from "../controllers/company/DasboardController";
import { CashbackController } from "../controllers/company/CashbackController";
import { PaymentMethodsController } from "../controllers/company/PaymentMethodsController";

const auth = new AuthController();
const dashboard = new DashboardController();
const cashback = new CashbackController();
const paymentMethod = new PaymentMethodsController();

const routes = Router();

routes.post("/sign-up", auth.registerNewCompany);
routes.post("/sign-in", auth.signUserCompany);
routes.get("/verify-token", auth.verifyToken);

routes.use(AuthMiddleware);

routes.get("/find-dashboard-data", dashboard.findDataToDashboard);
routes.get("/find-transaction-utils", Data.findTransactionUtils);
routes.post("/generate-cashback", cashback.generateCashback);
routes.post(
  "/generate-cashback/:code",
  cashback.generateCashbackWithTakebackPaymentMethod
);
routes.get("/find-payment-methods", paymentMethod.findAllCompanyMethods);

export default routes;
