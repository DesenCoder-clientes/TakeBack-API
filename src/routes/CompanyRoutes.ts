import { Router } from "express";

import * as Data from "../controllers/company/AppDataController";

import { AuthMiddleware } from "../middlewares/companyMiddlewares/AuthMiddleware";

import { AuthController } from "../controllers/company/AuthController";
import { DashboardController } from "../controllers/company/DasboardController";
import { CashbackController } from "../controllers/company/CashbackController";
import { PaymentMethodsController } from "../controllers/company/PaymentMethodsController";
import { CompanyUserController } from "../controllers/company/CompanyUserController";
import { CompanyDataController } from "../controllers/company/companyData/CompanyDataController";

const auth = new AuthController();
const dashboard = new DashboardController();
const cashback = new CashbackController();
const paymentMethod = new PaymentMethodsController();
const companyUser = new CompanyUserController();
const companyData = new CompanyDataController();

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
routes.get("/find-company-users", companyUser.findCompanyUsers);
routes.post("/register-company-user", companyUser.registerCompanyUser);
routes.put("/update-company-user", companyUser.updateCompanyUser);
routes.get("/find-company-data", companyData.findCompanyData);

export default routes;
