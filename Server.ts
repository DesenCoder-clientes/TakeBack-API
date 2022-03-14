import "reflect-metadata";
import "express-async-errors";

import * as dotenv from "dotenv";
import * as cors from "cors";
import * as express from "express";
import * as cron from "node-cron";

import { Request, Response, NextFunction } from "express";
import { UpdateCompanyPaymentMonthlyToFalseUseCase } from "./src/controllers/manager/managerCompanies/UpdateCompanyPaymentMonthlyToFalseUseCase";
import { VerifyCompanyMonthlyPaymentUseCase } from "./src/controllers/manager/managerCompanies/VerifyCompanyMonthlyPaymentUseCase";
import { VerifyCashbacksExpired } from "./src/controllers/manager/managerCompanies/VerifyCashbacksExpired";

import "./src/database";

import PublicRoutes from "./src/routes/PublicRoutes";
import SupportRoutes from "./src/routes/SupportRoutes";
import CostumerRoutes from "./src/routes/CostumerRoutes";
import CompanyRoutes from "./src/routes/CompanyRoutes";
import ManagerRoutes from "./src/routes/ManagerRoutes";
import { InternalError } from "./src/config/GenerateErros";
import { sendMail } from "./src/utils/SendMail";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", PublicRoutes);
app.use("/magic", SupportRoutes);
app.use("/costumer", CostumerRoutes);
app.use("/company", CompanyRoutes);
app.use("/manager", ManagerRoutes);

var mailList = ["wesleyleandro.dev@gmail.com", "izaquenunes560@gmail.com"];

cron
  .schedule(
    "0 0 1 * *",
    () => {
      const updatedCompaniesPaymentCurrentMonthly =
        new UpdateCompanyPaymentMonthlyToFalseUseCase();

      updatedCompaniesPaymentCurrentMonthly.execute();

      sendMail(
        mailList.toString(),
        "TAKEBACK - DEV CONTROLL",
        "APP TAKEBACK RESET COMPANIES PAYMENT MONTHLY"
      );
    },
    { scheduled: true, timezone: "America/Sao_Paulo" }
  )
  .start();

cron
  .schedule(
    "0 0 * * *",
    () => {
      const verifyPaymentMonthly = new VerifyCompanyMonthlyPaymentUseCase();
      const verifyCashbacksExpired = new VerifyCashbacksExpired();

      verifyPaymentMonthly.execute();
      verifyCashbacksExpired.execute();

      sendMail(
        mailList.toString(),
        "TAKEBACK - DEV CONTROLL",
        "CONGRATULATIONS! APP TAKEBACK COMPLETE VERICATIONS!"
      );
    },
    { scheduled: true, timezone: "America/Sao_Paulo" }
  )
  .start();

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
