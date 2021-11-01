import { Router } from "express";

import * as Auth from "../controllers/costumerControllers/AuthController";
import * as Data from "../controllers/costumerControllers/AppDataController";
import * as Update from "../controllers/costumerControllers/UpdateController";
import * as Pass from "../controllers/costumerControllers/PasswordControlle";

import { AuthMiddleware } from "../middlewares/costumerMiddlewares/AuthMiddleware";

const routes = Router();

routes.post("/sign-in", Auth.signIn);
routes.post("/sign-up", Auth.registerNewClient);

routes.use(AuthMiddleware);

routes.get("/find-app-data", Data.findAppData);
routes.put("/update-data", Update.updateData);
routes.put("/update-phone", Update.updatePhone);
routes.put("/update-email", Update.updateEmail);
routes.put("/update-address", Update.updateAddress);
routes.put("/update-password", Pass.updatePassword);

export default routes;
