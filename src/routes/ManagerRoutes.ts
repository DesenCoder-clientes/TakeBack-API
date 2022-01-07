import { Router } from "express";

import * as Category from "../controllers/manager/CategoriesController";
import { ManagerAuthController } from "../controllers/manager/managerAuth/ManagerAuthController";
import { CompaniesController } from "../controllers/manager/managerCompanies/CompaniesController";
import { PaymentMethodController } from "../controllers/manager/managerMethods/PaymentMethodsController";

const authorizationCompany = new CompaniesController();
const paymentMethod = new PaymentMethodController();
const managerAuth = new ManagerAuthController();

const routes = Router();

routes.post("/register-category", Category.registerCategory);
routes.post("/generate-manager-user", authorizationCompany.generateManagerUser);
routes.post("/register-payment-method", paymentMethod.registerPaymentMethod);
routes.post("/takeback/user/register", managerAuth.generateUser);
routes.post("/user/login", managerAuth.signInUser);

export default routes;
