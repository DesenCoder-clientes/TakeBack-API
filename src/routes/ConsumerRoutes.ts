import { Router } from "express";

import * as Auth from "../controllers/costumer/AuthController";
import * as Data from "../controllers/costumer/AppDataController";
import * as Update from "../controllers/costumer/UpdateController";
import * as Verify from "../controllers/costumer/VerifyController";
import * as Account from "../controllers/costumer/AccountController";
import * as Cashback from "../controllers/costumer/CashbackController";
import * as Forgot from "../controllers/costumer/ForgotController";

import { AuthMiddleware } from "../middlewares/costumerMiddlewares/AuthMiddleware";

const routes = Router();

routes.post("/sign-in", Auth.signIn);
routes.post("/sign-up", Account.newAccount);

routes.post("/confirm-data", Forgot.confirmDataToForgotPassword);
routes.put("/forgot-password/:id", Forgot.forgotPassword);

routes.use(AuthMiddleware);

routes.get("/find-app-data", Data.findAppData);

routes.put("/update-data", Update.updateData);
routes.put("/update-phone", Update.updatePhone);
routes.put("/update-email", Update.updateEmail);
routes.put("/update-address", Update.updateAddress);

routes.put("/update-password", Auth.updatePassword);
routes.post("/register-signature", Auth.registerSignature);
routes.put("/update-signature", Auth.updateSignature);

routes.get("/find-companies/:offset/:limit", Data.findCompanies);

routes.get("/find-transactions/:offset/:limit", Cashback.findTransactions);
routes.post("/authorized-purchase", Cashback.authorizePurchase);
routes.delete("/delete-transaction/:id", Cashback.dropTransaction);

routes.get("/send-mail-to-verify", Verify.sendMailToVerify);
routes.post("/verify-email", Verify.verifyEmail);

routes.delete("/deactivate-account", Account.deactivateAccount);

export default routes;
