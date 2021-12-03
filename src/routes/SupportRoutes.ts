import { Router } from "express";

import { SeedController } from "../controllers/support/Seed";

const seed = new SeedController();

const routes = Router();

routes.get("/seed", seed.generateAllSeeds);

export default routes;
