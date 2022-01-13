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
routes.post("/generate-manager-user", authorizationCompany.generateManagerUser);
routes.post("/takeback/user/register", managerAuth.generateUser);
routes.post("/user/login", managerAuth.signInUser);
routes.put("/user/update/:id", managerAuth.updateUser);
routes.get("/takeback/user/find-user", managerAuth.findUser);

routes.post("/register-industry", managerIndustry.registerIndustry);
routes.put("/industry/update/:id", managerIndustry.updateIndustry);
routes.get("/industry/find-industry", managerIndustry.findIndustry);

routes.get("/companies/list/:offset/:limit", managerCompanies.listCompany);
routes.get("/companies/find", managerCompanies.findCompany);

routes.get("/consumers/list/:offset/:limit", managerConsumers.listConsumer); 
routes.get("/consumers/find", managerConsumers.findConsumer);

routes.post("/register-payment-method", paymentMethod.registerPaymentMethod);


export default routes;
