import * as dotenv from "dotenv";
import "reflect-metadata";
import * as express from "express";
import * as cors from "cors";
import "./database";

import GlobalRoutes from "./routes/GlobalRoutes";
import SupportRoutes from "./routes/SupportRoutes";
import ConsumerRoutes from "./routes/ConsumerRoutes";
import CompanyRoutes from "./routes/CompanyRoutes";
import AdminRoutes from "./routes/AdminRoutes";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/global", GlobalRoutes);
app.use("/support", SupportRoutes);
app.use("/consumer", ConsumerRoutes);
app.use("/company", CompanyRoutes);
app.use("/admin", AdminRoutes);

app.listen(process.env.PORT || 3333);
