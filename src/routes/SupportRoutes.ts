import { Router } from "express";

import { SupportController } from "../controllers/support/SupportController";

const support = new SupportController();

const routes = Router();

routes.post("/seed", support.generateSeeds);

export default routes;
