import { Router } from "express";

import { FindAllIndustriesController } from "../controllers/public/FindIndustries";

const findIndustries = new FindAllIndustriesController();

const routes = Router();

routes.get("/find-industries", findIndustries.find);

export default routes;
