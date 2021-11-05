import { Router } from "express";

import * as Auth from "../controllers/costumerControllers/AuthController";
import * as Data from "../controllers/costumerControllers/AppDataController";
import * as Update from "../controllers/costumerControllers/UpdateController";
import * as Verify from "../controllers/costumerControllers/VerifyController";
import * as Account from "../controllers/costumerControllers/AccountController";
import * as Cashback from "../controllers/costumerControllers/CashbackController";

import { AuthMiddleware } from "../middlewares/costumerMiddlewares/AuthMiddleware";

const routes = Router();

routes.post("/sign-in", Auth.signIn);
routes.post("/sign-up", Account.newAccount);

routes.use(AuthMiddleware);

routes.get("/find-app-data", Data.findAppData);

routes.put("/update-data", Update.updateData);
routes.put("/update-phone", Update.updatePhone);
routes.put("/update-email", Update.updateEmail);
routes.put("/update-address", Update.updateAddress);

routes.put("/update-password", Auth.updatePassword);
routes.post("/register-signature", Auth.registerSignature);
routes.put("/update-signature", Auth.updateSignature);

routes.get("/find-companies/:skip", Data.findCompanies);

routes.get("/find-transactions/:skip", Cashback.findTransactions);

routes.get("/send-mail-to-verify", Verify.sendMailToVerify);
routes.post("/verify-email", Verify.verifyEmail);

routes.delete("/deactivate-account", Account.deactivateAccount);

export default routes;
