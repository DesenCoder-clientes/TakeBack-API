import { Router } from "express";

import * as Category from "../controllers/global/FindCategories";

const routes = Router();

routes.get("/find-all-categories", Category.findAllCategories);

export default routes;
