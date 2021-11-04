import { Router } from "express";

import * as Category from "../controllers/adminControllers/CategoriesController";

const routes = Router();

routes.post("/register-category", Category.registerCategory);

export default routes;
