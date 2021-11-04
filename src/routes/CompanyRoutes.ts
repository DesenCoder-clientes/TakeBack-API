import { Router } from "express";

import * as Account from "../controllers/companyControllers/AccountController";

const routes = Router();

routes.post("/sign-up", Account.signUp);

export default routes;
