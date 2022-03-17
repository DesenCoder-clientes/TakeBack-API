import { Router } from "express";

import { MagicController } from "../controllers/support/MagicController";

const magic = new MagicController();

const routes = Router();

routes.post("/seed", magic.generateAllSeeds);

export default routes;
