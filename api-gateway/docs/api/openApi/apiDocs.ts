import express from "express";
import swagger from "swagger-ui-express";
import openAPIDoc from "./openapi.json";
import { appEnv } from "../../../src/global/env/utils/appEnv/appEnv";

const app = express();
app.use("/api-docs", swagger.serve, swagger.setup(openAPIDoc));

app.listen(appEnv.documentationAppPort, () =>
	console.log(
		`running API Documentation on port ${appEnv.documentationAppPort}`,
	),
);
