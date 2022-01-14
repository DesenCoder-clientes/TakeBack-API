import { Router } from "express";

import { CostumerAuthController } from "../controllers/costumer/constumerAuth/ConstumerAuthController";
import { CostumerDataController } from "../controllers/costumer/costumerData/CostumerDataController";
import * as Data from "../controllers/costumer/AppDataController";
import * as Verify from "../controllers/costumer/VerifyController";
import * as Cashback from "../controllers/costumer/CashbackController";
import * as Forgot from "../controllers/costumer/ForgotController";

import { AuthMiddleware } from "../middlewares/costumerMiddlewares/AuthMiddleware";

const costumerAuth = new CostumerAuthController();
const costumerData = new CostumerDataController();

const routes = Router();

routes.post("/sign-in", costumerAuth.signInCostumer);
routes.post("/sign-up", costumerAuth.registerCostumer);

routes.post("/confirm-data", Forgot.confirmDataToForgotPassword);
routes.put("/forgot-password/:id", Forgot.forgotPassword);

routes.use(AuthMiddleware);

routes.get("/find-app-data", Data.findAppData);

routes.put("/update/data", costumerData.updateData);
routes.put("/update/phone", costumerData.updatePhone);
routes.put("/update/email", costumerData.updateEmail);
routes.put("/update/address", costumerData.updateAddress);
routes.post("/signature/register", costumerData.registerSignature);
routes.put("/signature/update", costumerData.updateSignature);

routes.put("/update/password", costumerAuth.updateCostumerPassword);
routes.delete("/account/deactivate", costumerAuth.desactiveCostumer);

routes.get("/find-companies/:offset/:limit", Data.findCompanies);

routes.get("/find-transactions/:offset/:limit", Cashback.findTransactions);
routes.post("/authorized-purchase", Cashback.authorizePurchase);
routes.delete("/delete-transaction/:id", Cashback.dropTransaction);

routes.get("/send-mail-to-verify", Verify.sendMailToVerify);
routes.post("/verify-email", Verify.verifyEmail);

export default routes;
