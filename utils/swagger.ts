import { Express } from "express";
import swaggerjJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import pkg from "../package.json";

const { version } = pkg;

const url = ``

const options = (port: number) => {
  return {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Sales Portal API",
        version: version,
        description: "AQA course project API",
      },
      servers: [
        {
          url: url || `http://localhost:${port}`,
        },
      ],
      components: {
          secutirySchemas: {
              bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT'
              }
          }
      },
      security: [
          {
              bearerAuth: []
          }
      ]
    },
    apis: ["./dist/routers/*.router.js"],
  };
};

function swaggerDocs(app: Express, port: number) {
  const swaggerSpec = swaggerjJsdoc(options(port));
  //Swagger Page
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //Docs in JSON format
  app.get("doc.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

export default swaggerDocs;
