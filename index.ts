import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import productsRouter from "./routers/products.router";
import customerRouter from "./routers/customer.router";
import orderRouter from "./routers/order.router";
import orderStatusRouter from "./routers/orderStatus.router";
import orderReceiveRouter from "./routers/orderReceive.router";
import authRouter from "./routers/auth.router";
import fileUpload from "express-fileupload";
import swaggerDocs from "./utils/swagger.js";
import orderDeliveryRouter from "./routers/orderDelivery.router";
import { errorHandleMiddleware } from "./middleware/errorHandleMiddleware";
import { authmiddleware } from "./middleware/authmiddleware";
import cors from 'cors'
// import swaggerjJsdoc from 'swagger-jsdoc'
// import swaggerUi from 'swagger-ui-express'
// import  pkg  from './package.json' assert { type: "json" }

// const { version } = pkg
dotenv.config();

const DB_URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.j9uiirp.mongodb.net/?retryWrites=true&w=majority`;

const PORT = +process.env.PORT;

const app = express();

const BASE_URL = process.env.ENVIRONMENT;

const cors_options: cors.CorsOptions = {
  // origin: ["http://127.0.0.1:5502", "https://anatoly-karpovich.github.io"],
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "preflightContinue": false,
    "optionsSuccessStatus": 200
};

// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5502");
//   // res.setHeader("Access-Control-Allow-Origin", "*");

//   // Request methods you wish to allow
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

//   // Request headers you wish to allow
//   res.setHeader("Access-Control-Allow-Headers", ["Authorization", "X-Requested-With,content-type"]);

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", "true");

//   // Pass to next layer of middleware
//   next();
// });
app.use(cors(cors_options))
app.options("*", cors());
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload({}));
app.use("/api", authRouter);
// app.use(authmiddleware);
app.use("/api", productsRouter);
app.use("/api", customerRouter);
app.use("/api", orderRouter);
app.use("/api", orderStatusRouter);
app.use("/api", orderReceiveRouter);
app.use("/api", orderDeliveryRouter);
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
startApp();
