import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthCompanyMiddleware } from "../middlewares/AuthCompanyMiddleware";

import { AuthCompanyController } from "../controllers/company/companyAuth/AuthCompanyController";
import { ReportsController } from "../controllers/company/companyReports/ReportsController";
import { CashbackController } from "../controllers/company/companyCashback/CashbackController";
import { PaymentMethodsController } from "../controllers/company/companyMethods/PaymentMethodsController";
import { CompanyUserController } from "../controllers/company/companyUser/CompanyUserController";
import { CompanyDataController } from "../controllers/company/companyData/CompanyDataController";
import { PaymentOrderController } from "../controllers/company/companyPaymentOrder/PaymentOrderController";

const auth = new AuthCompanyController();
const reports = new ReportsController();
const cashback = new CashbackController();
const paymentMethod = new PaymentMethodsController();
const companyUser = new CompanyUserController();
const companyData = new CompanyDataController();
const paymentOrder = new PaymentOrderController();

const routes = Router();

routes.post("/sign-up", auth.registerNewCompany);
routes.post("/sign-in", auth.signUserCompany);
routes.get("/verify-token", auth.verifyToken);

routes.use(DecodeTokenMiddleware, AuthCompanyMiddleware);

// routes.get("/find-app-data", reports.findAppData);
routes.get("/data/dashboard", reports.dashboardReports);
routes.get("/data/find", companyData.findCompanyData);
routes.put("/data/update", companyData.updateCompanyData);

routes.get("/cashback/costumer/:cpf", cashback.getConsumerInfo);

routes.post("/cashback", cashback.generateCashback);
routes.post(
  "/cashback/:code",
  cashback.generateCashbackWithTakebackPaymentMethod
);
routes.put("/cashback/cancel", cashback.cancelCashBack);

routes.get("/payments", paymentMethod.findCompanyMethods);
routes.get("/payments/cashier", paymentMethod.findCompanyMethodsForCashier);
routes.put("/payments/update", paymentMethod.updateCompanyMethod);
routes.post("/payments/register", paymentMethod.registerCompanyMethod);

routes.get("/user/find", companyUser.findCompanyUsers);
routes.post("/user/register", companyUser.registerCompanyUser);
routes.put("/user/update/:id", companyUser.updateCompanyUser);
routes.put("/user/password/update", companyUser.updatePassword);

routes.get("/cashbacks/find", cashback.findCashbacks);

routes.post("/cashback/payment/generate", paymentOrder.generate);
routes.put("/cashback/payment/cancel", paymentOrder.cancel);

export default routes;
