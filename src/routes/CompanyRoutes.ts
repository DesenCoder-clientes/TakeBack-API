import { Router } from "express";

import * as Account from "../controllers/company/AccountController";
import * as Data from "../controllers/company/AppDataController";
import * as Cashback from "../controllers/company/CashbackController";

import { RegisterCompanyController } from "../controllers/register/RegisterCompanyController";

const register = new RegisterCompanyController();

const routes = Router();

routes.post("/sign-up", Account.signUp);
routes.post("/teste", register.handle);

routes.get("/find-transaction-utils", Data.findTransactionUtils);
routes.post("/new-cashback", Cashback.newCashback);

export default routes;
