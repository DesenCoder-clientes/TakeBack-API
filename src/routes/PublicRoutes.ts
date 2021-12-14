import { Router } from "express";

import { PublicController } from "../controllers/public/PublicController";

const publicController = new PublicController();

const routes = Router();

routes.get("/find-industries", publicController.findIndustries);

export default routes;
