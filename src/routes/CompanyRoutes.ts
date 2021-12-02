import { Router } from "express";

import * as Data from "../controllers/company/AppDataController";
import * as Cashback from "../controllers/company/CashbackController";

import { AuthController } from "../controllers/company/Auth";

const Auth = new AuthController();

const routes = Router();

routes.post("/sign-up", Auth.registerNewCompany);

routes.get("/find-transaction-utils", Data.findTransactionUtils);
routes.post("/new-cashback", Cashback.newCashback);

export default routes;
