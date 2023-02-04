import { Express } from "express";
import swaggerjJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import pkg from "../package.json";

const { version } = pkg;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sales Portal API",
      version: version,
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    // components: {
    //     secutirySchemas: {
    //         bearerAuth: {
    //             type: 'http',
    //             scheme: 'bearer',
    //             bearerFormat: 'JWT'
    //         }
    //     }
    // },
    // security: [
    //     {
    //         bearerAuth: []
    //     }
    // ]
  },
  apis: ["./routers/*.router.js"],
};

const swaggerSpec = swaggerjJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  //Swagger Page
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //Docs in JSON format
  app.get("doc.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
