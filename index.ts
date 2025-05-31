import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import fileUpload from "express-fileupload";
import swaggerDocs from "./utils/swagger.js";
import { errorHandleMiddleware } from "./middleware/errorHandleMiddleware";
import cors from "cors";
import { startNotificationCleanup } from "./utils/cron";
import {
  authRouter,
  customerOrdersRouter,
  customerRouter,
  notificationRouter,
  orderCommentsRouter,
  orderDeliveryRouter,
  orderReceiveRouter,
  orderRouter,
  orderStatusRouter,
  productsRouter,
  rebatesRouter,
  usersRouter,
  metricsRouter,
} from "./routers/index.js";

dotenv.config();

const DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.j9uiirp.mongodb.net/?retryWrites=true&w=majority`;

const PORT = +process.env.PORT;

const app = express();

const BASE_URL = process.env.ENVIRONMENT;

const cors_options: cors.CorsOptions = {
  // origin: ["http://127.0.0.1:5502", "https://anatoly-karpovich.github.io"],
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  exposedHeaders: ["Authorization", "X-User-Name"],
};

app.use(cors(cors_options));
app.options("*", cors());
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload({}));
app.use("/api", rebatesRouter);
app.use("/api", authRouter);
app.use("/api", productsRouter);
app.use("/api", customerRouter);
app.use("/api", orderRouter);
app.use("/api", orderStatusRouter);
app.use("/api", orderReceiveRouter);
app.use("/api", orderDeliveryRouter);
app.use("/api", orderCommentsRouter);
app.use("/api", customerOrdersRouter);
app.use("/api", metricsRouter);
app.use("/api", usersRouter);
app.use("/api", notificationRouter);
app.use(errorHandleMiddleware);

async function startApp() {
  try {
    mongoose.connect(DB_URL, {});
    app.listen(PORT, () => {
      console.log("Server started on port " + PORT);
    });
    swaggerDocs(app);
  } catch (e) {
    console.log(e);
  }
}

startNotificationCleanup();

startApp();
