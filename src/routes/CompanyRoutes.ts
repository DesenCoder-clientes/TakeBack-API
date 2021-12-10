import { Router } from "express";

import * as Data from "../controllers/company/AppDataController";
import * as Cashback from "../controllers/company/CashbackController";

import { AuthMiddleware } from "../middlewares/companyMiddlewares/AuthMiddleware";

import { AuthController } from "../controllers/company/AuthController";
import { DashboardController } from "../controllers/company/DasboardController";
import { PaymentMethodController } from "../controllers/manager/PaymentMethods";

const auth = new AuthController();
const dashboard = new DashboardController();
const paymentMethod = new PaymentMethodController();

const routes = Router();

routes.post("/sign-up", auth.registerNewCompany);
routes.post("/sign-in", auth.signUserCompany);
routes.get("/verify-token", auth.verifyToken);

routes.use(AuthMiddleware);

routes.get("/find-dashboard-data", dashboard.findDataToDashboard);
routes.get("/find-transaction-utils", Data.findTransactionUtils);
routes.post("/new-cashback", Cashback.newCashback);
routes.get("/find-payment-methods", paymentMethod.findAllPaymentMethods);

export default routes;
