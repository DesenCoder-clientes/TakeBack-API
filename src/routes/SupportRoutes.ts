import { Router } from "express";

import { MagicController } from "../controllers/support/MagicController";

const magic = new MagicController();

const routes = Router();

routes.post("/seed", magic.generateAllSeeds);
routes.post("/takeback/user-root/register", magic.generateTakeBackUser);

export default routes;
