import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthManagerMiddleware } from "../middlewares/AuthManagerMiddleware";

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

routes.post("/user/login", managerAuth.signInUser);
routes.post("/user", managerAuth.registerUser);
routes.get("/verify-token", managerAuth.verifyToken);

routes.use(DecodeTokenMiddleware, AuthManagerMiddleware);

routes.put("/user/:id", managerAuth.updateUser);
routes.get("/user/:offset/:limit", managerAuth.findUser);
routes.put("/user/password/update", managerAuth.updateUserPassword);
routes.get("/find-user-type", managerAuth.findUserType);

routes.post("/company/user", authorizationCompany.generateManagerUser);

routes.post("/industry", managerIndustry.registerIndustry);
routes.put("/industry/:id", managerIndustry.updateIndustry);
routes.get("/industry/:offset/:limit", managerIndustry.findIndustry);

routes.get("/companies/:offset/:limit", managerCompanies.listCompany);
routes.get("/companies", managerCompanies.findCompany);

routes.get("/consumers/:offset/:limit", managerConsumers.listConsumer);
routes.get("/consumers", managerConsumers.findConsumer);

routes.post("/payment", paymentMethod.registerPaymentMethod);

export default routes;
