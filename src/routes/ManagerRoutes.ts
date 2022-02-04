import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthManagerMiddleware } from "../middlewares/AuthManagerMiddleware";

import { ManagerAuthController } from "../controllers/manager/managerAuth/ManagerAuthController";
import { CompaniesController } from "../controllers/manager/managerCompanies/CompaniesController";
import { ConsumersController } from "../controllers/manager/managerConsumers/ConsumersController";
import { ManagerIndustryController } from "../controllers/manager/managerIndustry/ManagerIndustryController";
import { PaymentMethodController } from "../controllers/manager/managerMethods/PaymentMethodsController";
import { ManagerCompanyStatusController } from "../controllers/manager/managerCompanyStatus/ManagerCompanyStatusController";

const authorizationCompany = new CompaniesController();
const paymentMethod = new PaymentMethodController();
const managerAuth = new ManagerAuthController();
const managerIndustry = new ManagerIndustryController();
const managerCompanies = new CompaniesController();
const managerConsumers = new ConsumersController();
const managerCompanyStatus = new ManagerCompanyStatusController();

const routes = Router();

routes.post("/user/login", managerAuth.signInUser);
routes.get("/verify-token", managerAuth.verifyToken);

routes.use(DecodeTokenMiddleware, AuthManagerMiddleware);

routes.post("/user/register", managerAuth.registerUser);
routes.put("/user/update/:id", managerAuth.updateUser);
routes.get("/user/find/:offset/:limit", managerAuth.findUser);
routes.put("/user/password/update", managerAuth.updateUserPassword);
routes.put("/user/password/forgot/:id", managerAuth.forgotPassword);
routes.get("/user/types/find", managerAuth.findUserType);

routes.post("/company/user", authorizationCompany.generateManagerUser);

routes.post("/industry", managerIndustry.registerIndustry);
routes.put("/industry/:id", managerIndustry.updateIndustry);
routes.get("/industry/:offset/:limit", managerIndustry.findIndustry);
routes.get("/industry/find", managerIndustry.findIndustryNotPaginated);

routes.get("/companies/find/:offset/:limit", managerCompanies.listCompany);

routes.get(
  "/companies/search/:offset/:limit",
  managerCompanies.listCompanyWithSearch
);

routes.put("/companies/update/:id", managerCompanies.updateCompany);

routes.get("/companies/status", managerCompanyStatus.findCompanyStatus);

routes.get("/consumers/find/:offset/:limit", managerConsumers.listConsumer);
routes.get("/consumers/search/:offset/:limit", managerConsumers.searchConsumer);
routes.get("/consumers/:id", managerConsumers.findConsumerData);
routes.put("/consumers/update/:id", managerConsumers.updateConsumerStatus);

routes.get("/cities/findAll", managerConsumers.listCities);

routes.post("/payment", paymentMethod.registerPaymentMethod);

export default routes;
