import type { Express, NextFunction, Response } from "express";
import { ApiError } from "../../../../../application/errors/api/apiError";
import { ApiValidationError } from "../../../../../application/errors/apiValidation/apiValidationError";
import type { appErrors } from "../../../../../application/errors/appErrors/appErrors";
import { ServerError } from "../../../../../application/errors/server/serverError";
import type { logger } from "../../../../../application/logger/logger";

export class ExpressErrorHandlerMiddleware {
	constructor(
		public app: Express,
		public logger: logger,
	) {}

	exec() {
		this.app.use(
			(err: appErrors, _: unknown, res: Response, next: NextFunction) => {
				if (err instanceof ServerError) {
					this.logger.error(err);
					res.status(err.statusCode || 500).json({
						message: "Server error. Cannot process the request",
					});

					if (!err.operational) return process.exit(1);
					return;
				}

				return next(err);
			},
		);

		this.app.use(
			(err: appErrors, _: unknown, res: Response, next: NextFunction) => {
				if (err instanceof ApiError) {
					this.logger.error(err);

					res.status(err.statusCode || 500).json({
						message: `${err.name}: ${err.message}`,
					});

					if (!err.operational) return process.exit(1);
					return;
				}

				return next(err);
			},
		);
		this.app.use(
			(err: appErrors, _: unknown, res: Response, next: NextFunction) => {
				if (err instanceof ApiValidationError) {
					this.logger.error(err);
					res.status(err.statusCode || 500).json({
						message: "API Validation error. Cannot process the request",
					});

					if (!err.operational) return process.exit(1);
					return;
				}

				return next(err);
			},
		);

		this.app.use(
			(err: appErrors, _: unknown, res: Response, next: NextFunction) => {
				this.logger.error(err);
				return res.status(500).json({
					message: "Unexpected unknown error. Cannot process request",
				});
			},
		);

		return this.app;
	}
}
