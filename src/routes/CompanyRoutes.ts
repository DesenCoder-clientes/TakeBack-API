import { Router } from "express";

import * as Account from "../controllers/companyControllers/AccountController";
import * as Data from "../controllers/companyControllers/AppDataController";
import * as Cashback from "../controllers/companyControllers/CashbackController";

const routes = Router();

routes.post("/sign-up", Account.signUp);

routes.get("/find-transaction-utils", Data.findTransactionUtils);
routes.post("/new-cashback", Cashback.newCashback);

export default routes;
