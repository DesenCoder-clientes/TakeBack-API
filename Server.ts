import "reflect-metadata";
import "express-async-errors";

import "./src/database";

import * as dotenv from "dotenv";
import * as cors from "cors";
import * as express from "express";
import * as cron from "node-cron";
import * as http from "http";

import { Request, Response, NextFunction } from "express";
import { InternalError } from "./src/config/GenerateErros";
import { sendMail } from "./src/utils/SendMail";
import { VerifyProvisionalAccessUseCase } from "./src/controllers/manager/managerCompanies/VerifyProvisionalAccessUseCase";
import { UpdateCompanyPaymentMonthlyToFalseUseCase } from "./src/controllers/manager/managerCompanies/UpdateCompanyPaymentMonthlyToFalseUseCase";
import { VerifyCompanyMonthlyPaymentUseCase } from "./src/controllers/manager/managerCompanies/VerifyCompanyMonthlyPaymentUseCase";
import { VerifyCashbacksExpired } from "./src/controllers/manager/managerCompanies/VerifyCashbacksExpired";

import SupportRoutes from "./src/routes/SupportRoutes";
import CostumerRoutes from "./src/routes/CostumerRoutes";
import CompanyRoutes from "./src/routes/CompanyRoutes";
import ManagerRoutes from "./src/routes/ManagerRoutes";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (request: Request, response: Response) => {
  return response.status(200).send("TAKE BACK!");
});

app.use("/costumer", CostumerRoutes);
app.use("/company", CompanyRoutes);
app.use("/manager", ManagerRoutes);
app.use("/support", SupportRoutes);

var mailList = [
  "wesleyleandro.dev@gmail.com",
  "izaquenunes560@gmail.com",
  "leo.sousa3108@gmail.com",
];

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
      const verifyCashbacksExpired = new VerifyCashbacksExpired();
      const verifyPaymentMonthly = new VerifyCompanyMonthlyPaymentUseCase();
      const VerifyProvionalAccess = new VerifyProvisionalAccessUseCase();

      verifyCashbacksExpired.execute();
      verifyPaymentMonthly.execute();
      VerifyProvionalAccess.execute();

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

const server = http.createServer(app);

const PORT = 3333;
const HOST = "0.0.0.0";

server.listen(PORT, HOST);
