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

routes.get("/data/dashboard", reports.dashboardReports);
routes.get("/data/find", companyData.findCompanyData);
routes.put("/data/update", companyData.updateCompanyData);

routes.get("/payments-methods/find/system", paymentMethod.findPaymentMethods);
routes.get("/payments-methods/find", paymentMethod.findCompanyPaymentMethods);
routes.get(
  "/payments-methods/find/cashier",
  paymentMethod.findCompanyPaymentMethodsForCashier
);
routes.put(
  "/payments-methods/update",
  paymentMethod.updateCompanyPaymentMethod
);
routes.post(
  "/payments-methods/register",
  paymentMethod.registerCompanyPaymentMethod
);

routes.get("/user/find", companyUser.findCompanyUsers);
routes.post("/user/register", companyUser.registerCompanyUser);
routes.put("/user/update/:id", companyUser.updateCompanyUser);
routes.put("/user/password/update", companyUser.updatePassword);

routes.get("/cashback/costumer/:cpf", cashback.getConsumerInfo);
routes.post("/cashback/generate", cashback.generateCashback);
routes.put("/cashback/cancel", cashback.cancelCashBack);
routes.get("/cashbacks/find/all", cashback.findCashbacks);
routes.post("/cashback/payment/generate", paymentOrder.generate);
routes.put("/cashback/payment/cancel/:id", paymentOrder.cancel);
routes.get("/cashback/payment/methods/findAll", paymentOrder.findPaymentMethod);

export default routes;
