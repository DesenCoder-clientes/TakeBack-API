import { Router } from "express";

import { ManagerAuthController } from "../controllers/manager/managerAuth/ManagerAuthController";
import { CompaniesController } from "../controllers/manager/managerCompanies/CompaniesController";
import { ConsumersController } from "../controllers/manager/managerConsumers/ConsumersController";
import { ManagerIndustryController } from "../controllers/manager/managerIndustry/ManagerIndustryController";
import { PaymentMethodController } from "../controllers/manager/managerMethods/PaymentMethodsController";

const authorizationCompany = new CompaniesController();
const paymentMethod = new PaymentMethodController();
const managerAuth = new ManagerAuthController();
const managerIndustry = new ManagerIndustryController();
const managerCompanies = new CompaniesController();
const managerConsumers = new ConsumersController();

const routes = Router();

routes.get("/verify-token", managerAuth.verifyToken);
routes.post("/user", managerAuth.generateUser);
routes.post("/user/login", managerAuth.signInUser);
routes.put("/user/:id", managerAuth.updateUser);
routes.get("/user", managerAuth.findUser);

routes.post("/company/user", authorizationCompany.generateManagerUser);

routes.post("/industry", managerIndustry.registerIndustry);
routes.put("/industry/:id", managerIndustry.updateIndustry);
routes.get("/industry", managerIndustry.findIndustry);

routes.get("/companies/:offset/:limit", managerCompanies.listCompany);
routes.get("/companies", managerCompanies.findCompany);

routes.get("/consumers/:offset/:limit", managerConsumers.listConsumer);
routes.get("/consumers", managerConsumers.findConsumer);

routes.post("/payment", paymentMethod.registerPaymentMethod);

export default routes;
