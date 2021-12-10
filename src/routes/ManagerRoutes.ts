import { Router } from "express";

import * as Category from "../controllers/manager/CategoriesController";
import { AuthorizationCompanyController } from "../controllers/manager/AuthorizationCompany";
import { PaymentMethodController } from "../controllers/manager/PaymentMethods";

const authorizationCompany = new AuthorizationCompanyController();
const paymentMethod = new PaymentMethodController();

const routes = Router();

routes.post("/register-category", Category.registerCategory);
routes.post("/generate-manager-user", authorizationCompany.generateManagerUser);
routes.post("/register-payment-method", paymentMethod.registerPaymentMethod);
routes.get("/find-payment-methods", paymentMethod.findAllPaymentMethods);
routes.get("/find-payment-methods/:id", paymentMethod.findOnePaymentMethod);

export default routes;
