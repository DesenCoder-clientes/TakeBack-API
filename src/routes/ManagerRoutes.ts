import { Router } from "express";

import * as Category from "../controllers/manager/CategoriesController";
import { AuthorizationCompanyController } from "../controllers/manager/AuthorizationCompany";

const authorizationCompany = new AuthorizationCompanyController();

const routes = Router();

routes.post("/register-category", Category.registerCategory);
routes.post("/generate-manager-user", authorizationCompany.generateManagerUser);

export default routes;
