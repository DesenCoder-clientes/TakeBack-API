import { Router } from "express";

import * as Category from "../controllers/manager/CategoriesController";
import { ManagerAuthController } from "../controllers/manager/managerAuth/ManagerAuthController";
import { CompaniesController } from "../controllers/manager/managerCompanies/CompaniesController";
import { PaymentMethodController } from "../controllers/manager/managerMethods/PaymentMethodsController";

const authorizationCompany = new CompaniesController();
const paymentMethod = new PaymentMethodController();
const registerUser = new ManagerAuthController();

const routes = Router();

routes.post("/register-category", Category.registerCategory);
routes.post("/generate-manager-user", authorizationCompany.generateManagerUser);
routes.post("/register-payment-method", paymentMethod.registerPaymentMethod);
routes.post("/user/register", registerUser.generateUser);
routes.post("/user/login", registerUser.signInUser);

export default routes;
