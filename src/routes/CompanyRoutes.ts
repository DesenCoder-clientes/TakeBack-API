import { Router } from "express";

import { AuthMiddleware } from "../middlewares/companyMiddlewares/AuthMiddleware";

import { AuthCompanyController } from "../controllers/company/companyAuth/AuthCompanyController";
import { ReportsController } from "../controllers/company/companyReports/ReportsController";
import { CashbackController } from "../controllers/company/companyCashback/CashbackController";
import { PaymentMethodsController } from "../controllers/company/companyMethods/PaymentMethodsController";
import { CompanyUserController } from "../controllers/company/companyUser/CompanyUserController";
import { CompanyDataController } from "../controllers/company/companyData/CompanyDataController";

const auth = new AuthCompanyController();
const reports = new ReportsController();
const cashback = new CashbackController();
const paymentMethod = new PaymentMethodsController();
const companyUser = new CompanyUserController();
const companyData = new CompanyDataController();

const routes = Router();

routes.post("/sign-up", auth.registerNewCompany);
routes.post("/sign-in", auth.signUserCompany);
routes.get("/verify-token", auth.verifyToken);

routes.use(AuthMiddleware);

routes.get("/find-app-data", reports.findAppData);
routes.get("/find-dashboard-data", reports.dashboardReports);
routes.get("/find-costumer-data/:cpf", cashback.getConsumerInfo);
routes.post("/generate-cashback", cashback.generateCashback);
routes.post(
  "/generate-cashback/:code",
  cashback.generateCashbackWithTakebackPaymentMethod
);
routes.get("/find-payment-methods", paymentMethod.findCompanyMethods);
routes.get(
  "/find-payment-methods/cashier",
  paymentMethod.findCompanyMethodsForCashier
);
routes.get("/find-company-users", companyUser.findCompanyUsers);
routes.post("/register-company-user", companyUser.registerCompanyUser);
routes.put("/update-company-user", companyUser.updateCompanyUser);
routes.get("/find-company-data", companyData.findCompanyData);
routes.put("/update-company-data", companyData.updateCompanyData);
routes.put("/update-company-method", paymentMethod.updateCompanyMethod);
routes.post("/register-company-method", paymentMethod.registerCompanyMethod);

export default routes;
