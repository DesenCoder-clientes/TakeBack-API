import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthCompanyMiddleware } from "../middlewares/AuthCompanyMiddleware";
import { VerifyIfIsAuthorizedToEmitCashbacks } from "../middlewares/VerifyIfIsAuthorizedToEmitCashbacks";

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
routes.get("/industries/find", companyData.findIndustries);

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
routes.put(
  "/user/password/update/root/:id",
  companyUser.rootUserUpdateUserPassword
);

routes.get("/cashbacks/expired", cashback.verifyCashbacksExpired);
routes.post(
  "/cashback/confirm-password",
  VerifyIfIsAuthorizedToEmitCashbacks,
  cashback.validateUserPasswordToGenerateCashback
);
routes.get(
  "/cashback/costumer/:cpf",
  VerifyIfIsAuthorizedToEmitCashbacks,
  cashback.getConsumerInfo
);
routes.post(
  "/cashback/generate",
  VerifyIfIsAuthorizedToEmitCashbacks,
  cashback.generateCashback
);
routes.put("/cashback/cancel", cashback.cancelCashBack);
routes.get("/cashbacks/find/pending", cashback.findPendingCashbacks);
routes.get("/cashbacks/find/all/:offset/:limit", cashback.findAllCashbacks);
routes.get("/cashbacks/find/filters", cashback.findCashbackFilters);

routes.post("/order/payment/generate", paymentOrder.generate);
routes.put("/order/payment/cancel/:id", paymentOrder.cancel);
routes.get("/order/payment/methods/findAll", paymentOrder.findPaymentMethod);
routes.get("/order/find/all/:offset/:limit", paymentOrder.findOrders);
routes.get(
  "/order/find/transactions/:id",
  paymentOrder.findTransactionsInPaymentOrder
);

export default routes;
