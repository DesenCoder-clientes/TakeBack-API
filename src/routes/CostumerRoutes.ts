import { Router } from "express";

import { DecodeTokenMiddleware } from "../middlewares/DecodeTokenMiddleware";
import { AuthCostumerMiddleware } from "../middlewares/AuthCostumerMiddleware";

import { CostumerAuthController } from "../controllers/costumer/constumerAuth/ConstumerAuthController";
import { CostumerDataController } from "../controllers/costumer/costumerData/CostumerDataController";
import { CostumerCashBackController } from "../controllers/costumer/costumerCashBack/CostumerCashBackController";
import { CostumerVerifyController } from "../controllers/costumer/costumerVerify/CostumerVerifyController";

const costumerAuth = new CostumerAuthController();
const costumerData = new CostumerDataController();
const costumerCashBack = new CostumerCashBackController();
const costumerVerify = new CostumerVerifyController();

const routes = Router();

routes.post("/sign-in", costumerAuth.signInCostumer);
routes.post("/sign-up", costumerAuth.registerCostumer);

routes.post(
  "/confirm-data-to-forgot-password",
  costumerAuth.confirmDataToForgotPassword
);
routes.put("/forgot-password/:id", costumerAuth.forgotPassword);
routes.get("/verify-if-exists/:cpf", costumerAuth.verifyIfUserAlreadyExists);

routes.use(DecodeTokenMiddleware, AuthCostumerMiddleware);

routes.get("/data/find", costumerData.findAppData);

routes.put("/update/data", costumerData.updateData);
routes.put("/update/phone", costumerData.updatePhone);
routes.put("/update/email", costumerData.updateEmail);
routes.put("/update/address", costumerData.updateAddress);
routes.post("/signature/register", costumerData.registerSignature);
routes.put("/signature/update", costumerData.updateSignature);
routes.get("/companies/find/:offset/:limit", costumerData.findCompanies);
routes.get("/company/find/:id", costumerData.findOneCompany);

routes.put("/update/password", costumerAuth.updateCostumerPassword);
routes.delete("/account/deactive", costumerAuth.desactiveCostumer);

routes.post("/cashback/authorize", costumerCashBack.authorizePurchase);
routes.get("/cashback/find/:offset/:limit", costumerCashBack.findTransaction);
routes.get("/cashback/details/:id", costumerCashBack.findCashbackDetails);
routes.delete("/cashback/delete/:id", costumerCashBack.dropTransaction);

routes.get("/verify/send-mail", costumerVerify.sendMailToVerify);
routes.post("/verify/email", costumerVerify.verifyEmail);

export default routes;
