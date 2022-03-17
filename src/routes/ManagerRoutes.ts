import { Router } from "express";
import multer = require("multer");

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthManagerMiddleware } from "../middlewares/AuthManagerMiddleware";
import { TicketMiddleware } from "../middlewares/TicketMiddleware";

import { ManagerAuthController } from "../controllers/manager/managerAuth/ManagerAuthController";
import { CompaniesController } from "../controllers/manager/managerCompanies/CompaniesController";
import { ConsumersController } from "../controllers/manager/managerConsumers/ConsumersController";
import { ManagerIndustryController } from "../controllers/manager/managerIndustry/ManagerIndustryController";
import { PaymentMethodController } from "../controllers/manager/managerMethods/PaymentMethodsController";
import { ManagerCompanyStatusController } from "../controllers/manager/managerCompanyStatus/ManagerCompanyStatusController";
import { DataController } from "../controllers/manager/managerData/DataController";
import { DashboardController } from "../controllers/manager/managerDashboard/ManagerDashboardController";
import { PaymentPlanController } from "../controllers/manager/managerPaymentPlan/PaymentPlanController";
import { PaymentOrderController } from "../controllers/manager/managerPaymentOrder/PaymentOrderController";
import { ManagerCitiesController } from "../controllers/manager/managerCities/ManagerCitiesController";
import { ReportsController } from "../controllers/manager/managerReports/ReportsController";

const paymentMethod = new PaymentMethodController();
const managerAuth = new ManagerAuthController();
const managerIndustry = new ManagerIndustryController();
const managerCompanies = new CompaniesController();
const managerConsumers = new ConsumersController();
const managerCompanyStatus = new ManagerCompanyStatusController();
const managerData = new DataController();
const managerDashboard = new DashboardController();
const managerPaymentPlan = new PaymentPlanController();
const managerPaymentOrder = new PaymentOrderController();
const managerCities = new ManagerCitiesController();
const managerReports = new ReportsController();

const routes = Router();

routes.post("/user/login", managerAuth.signInUser);
routes.get("/verify-token", managerAuth.verifyToken);

routes.use(DecodeTokenMiddleware, AuthManagerMiddleware);

routes.get("/data/find", managerData.findDataToUseInApp);

routes.post("/user/register", managerAuth.registerUser);
routes.put("/user/update/:id", managerAuth.updateUser);
routes.get("/user/find/:offset/:limit", managerAuth.findUser);
routes.put("/user/password/update", managerAuth.updateUserPassword);
routes.put("/user/password/forgot/:id", managerAuth.forgotPassword);
routes.get("/user/types/find", managerAuth.findUserType);

routes.post("/industry", managerIndustry.registerIndustry);
routes.put("/industry/:id", managerIndustry.updateIndustry);
routes.get("/industry/find", managerIndustry.findAllIndustries);

routes.post("/company/allow-access", managerCompanies.allowFirstAccess);
routes.get(
  "/company/find/all/:offset/:limit",
  managerCompanies.findAllCompanies
);
routes.get("/company/find/one/:id", managerCompanies.findOneCompany);
routes.get(
  "/company/search/:offset/:limit",
  managerCompanies.listCompanyWithSearch
);
routes.put("/company/update/:id", managerCompanies.updateCompany);
routes.put("/company/fee/update/:id", managerCompanies.updateCustomFee);
routes.get("/company/status/find", managerCompanyStatus.findCompanyStatus);
routes.put(
  "/company/status/update/:id",
  managerCompanyStatus.updateCompanyStatus
);
routes.put("/company/plan/update/:id", managerCompanies.updatePaymentPlan);
routes.put(
  "/company/forgot-password/:id",
  managerCompanies.forgotPasswordToRootUser
);
routes.put(
  "/company/many-status/update/",
  managerCompanies.updateManyCompanyStatus
);
routes.post(
  "/company/provisional-access/generate/:id",
  managerCompanyStatus.generateProvisionalAccess
);

routes.get(
  "/consumers/find/all/:offset/:limit",
  managerConsumers.findAllConsumers
);
routes.get("/consumers/find/one/:id", managerConsumers.findOneConsumer);
routes.get("/consumers/search/:offset/:limit", managerConsumers.searchConsumer);
routes.put(
  "/consumers/update/status/:id",
  managerConsumers.updateConsumerStatus
);

routes.get("/cities/findAll", managerConsumers.listCities);
routes.get("/cities/find/all", managerCities.findAllCities);

routes.get("/payment/find", paymentMethod.findAll);
routes.post("/payment/register", paymentMethod.register);
routes.put("/payment/update/:id", paymentMethod.update);

routes.get("/plan/find", managerPaymentPlan.findAll);
routes.post("/plan/register", managerPaymentPlan.register);
routes.put("/plan/update/:id", managerPaymentPlan.update);

routes.get("/dashboard/find", managerDashboard.dashboardReport);

routes.get("/order/find/all/:offset/:limit", managerPaymentOrder.findOrder);
routes.get("/order/find/filters", managerPaymentOrder.findFilterOptions);
routes.get(
  "/order/find/transactions/:id",
  managerPaymentOrder.findTransactionsInPaymentOrder
);
routes.put(
  "/order/approve/:id",
  managerPaymentOrder.approveOrderAndReleaseCashbacks
);
routes.put(
  "/order/update/status/:id",
  managerPaymentOrder.updatePaymentOrderStatus
);
routes.post(
  "/order/send-payment-info/:id",
  multer(TicketMiddleware).single("Boleto"),
  managerPaymentOrder.sendPaymentInfoToEmail
);

routes.get("/report/find/filters", managerReports.findFilterOptions);
routes.get("/report/payment-order", managerReports.paymentOrderReport);
routes.get("/report/monthly-payment", managerReports.monthlyReport);

export default routes;
