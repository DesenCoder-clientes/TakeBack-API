import { Router } from "express";

import * as Category from "../controllers/globalControllers/FindCategories";

const routes = Router();

routes.get("/find-all-categories", Category.findAllCategories);

export default routes;
