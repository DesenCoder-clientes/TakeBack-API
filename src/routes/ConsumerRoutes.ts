import { Router } from "express";

import * as Generic from "../controllers/generalControllers/FindGenericDataController";
import * as Auth from "../controllers/costumerControllers/AuthController";
import * as Data from "../controllers/costumerControllers/AppDataController";

import { AuthMiddleware } from "../middlewares/costumerMiddlewares/AuthMiddleware";

const routes = Router();

routes.post("/sign-in", Auth.signIn);
routes.post("/sign-up", Auth.registerNewClient);

routes.use(AuthMiddleware);

routes.get("/find-app-data", Data.findAppData);
routes.get("/find-all-cities", Generic.getAllCities);

export default routes;
