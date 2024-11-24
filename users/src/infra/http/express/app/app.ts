import httpCompress from "compression";
import express, { type Response } from "express";
import helmet from "helmet";
import type { logger } from "../../../../application/logger/logger";
import { ExpressErrorHandlerMiddleware } from "../middlewares/errorHandling/expressErrorHandlerMiddleware";
import { corsConfigMiddleware } from "../middlewares/utils/cors/corsMiddlewareConfig";
import type { UsersRouter } from "../routers/users/usersRouter";

export class ExpressApp {
	constructor(
		private usersRouter: UsersRouter,
		private logger: logger,
	) {}

	exec() {
		const usersRouter = this.usersRouter.exec();
		const app = express();
		app.use(express.json());
		app.use(helmet());
		app.use(httpCompress());
		app.use(corsConfigMiddleware());
		app.use(usersRouter);
		app.get("/health", this.#healthCheck);

		const expressErrorHandling = new ExpressErrorHandlerMiddleware(
			app,
			this.logger,
		);
		expressErrorHandling.exec();

		return app;
	}

	#healthCheck(_: unknown, res: Response) {
		res.sendStatus(200);
	}
}
