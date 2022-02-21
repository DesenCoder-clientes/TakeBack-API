import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthManagerMiddleware } from "../middlewares/AuthManagerMiddleware";

import { ManagerAuthController } from "../controllers/manager/managerAuth/ManagerAuthController";
import { CompaniesController } from "../controllers/manager/managerCompanies/CompaniesController";
import { ConsumersController } from "../controllers/manager/managerConsumers/ConsumersController";
import { ManagerIndustryController } from "../controllers/manager/managerIndustry/ManagerIndustryController";
import { PaymentMethodController } from "../controllers/manager/managerMethods/PaymentMethodsController";
import { ManagerCompanyStatusController } from "../controllers/manager/managerCompanyStatus/ManagerCompanyStatusController";
import { DataController } from "../controllers/manager/managerData/DataController";
import { DashboardController } from "../controllers/manager/managerDashboard/ManagerDashboardController";
import { PaymentPlanController } from "../controllers/manager/managerPaymentPlan/PaymentPlanController";
import { ManagerPaymentOrderController } from "../controllers/manager/managerPaymentOrder/ManagerPaymentOrderController";

const paymentMethod = new PaymentMethodController();
const managerAuth = new ManagerAuthController();
const managerIndustry = new ManagerIndustryController();
const managerCompanies = new CompaniesController();
const managerConsumers = new ConsumersController();
const managerCompanyStatus = new ManagerCompanyStatusController();
const managerData = new DataController();
const managerDashboard = new DashboardController();
const managerPaymentPlan = new PaymentPlanController();
const managerPaymentOrder = new ManagerPaymentOrderController();

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

routes.get("/consumers/find/:offset/:limit", managerConsumers.listConsumer);
routes.get("/consumers/search/:offset/:limit", managerConsumers.searchConsumer);
routes.get("/consumers/:id", managerConsumers.findConsumerData);
routes.put("/consumers/update/:id", managerConsumers.updateConsumerStatus);

routes.get("/cities/findAll", managerConsumers.listCities);

routes.get("/payment/find", paymentMethod.findAll);
routes.post("/payment/register", paymentMethod.register);
routes.put("/payment/update/:id", paymentMethod.update);

routes.get("/plan/find", managerPaymentPlan.findAll);
routes.post("/plan/register", managerPaymentPlan.register);
routes.put("/plan/update/:id", managerPaymentPlan.update);

routes.get("/dashboard", managerDashboard.dashboardReport);

routes.get("/order/findAll/:offset/:limit", managerPaymentOrder.findOrder);
routes.put("/order/approve/:id", managerPaymentOrder.approveOrder);

export default routes;
