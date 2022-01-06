import * as dotenv from "dotenv";
import "reflect-metadata";
import "express-async-errors";
import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as cors from "cors";
import "./src/database";

import PublicRoutes from "./src/routes/PublicRoutes";
import SupportRoutes from "./src/routes/SupportRoutes";
import ConsumerRoutes from "./src/routes/ConsumerRoutes";
import CompanyRoutes from "./src/routes/CompanyRoutes";
import ManagerRoutes from "./src/routes/ManagerRoutes";
import { InternalError } from "./src/config/GenerateErros";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", PublicRoutes);
app.use("/magic", SupportRoutes);
app.use("/consumer", ConsumerRoutes);
app.use("/company", CompanyRoutes);
app.use("/manager", ManagerRoutes);


app.use(
  (err: InternalError, req: Request, res: Response, next: NextFunction) => {
    if (err && err.statusCode) {
      res
        .status(err.statusCode)
        .json({ name: err.name, status: err.statusCode, message: err.message });
    }
  }
);

app.listen(process.env.PORT || 3333);
