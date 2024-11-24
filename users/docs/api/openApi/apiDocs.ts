import express from "express";
import swagger from "swagger-ui-express";
import { appEnv } from "../../../src/global/utils/env/appEnv/appEnv"
import openAPIDoc from "./openapi.json";

const app = express();
app.use("/api-docs", swagger.serve, swagger.setup(openAPIDoc));

app.listen(appEnv.documentationAppPort, () =>
	console.log(
		`running API Documentation on port ${appEnv.documentationAppPort}`,
	),
);
