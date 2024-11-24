import type { Express, NextFunction, Response } from "express";
import { ApiError } from "../../../../../application/errors/api/apiError";
import { ApiValidationError } from "../../../../../application/errors/apiValidation/apiValidationError";
import type { appErrors } from "../../../../../application/errors/appErrors/appErrors";
import { ServerError } from "../../../../../application/errors/server/serverError";
import type { logger } from "../../../../../application/logger/logger";
import { JWTTokensError } from "../../../../../application/tokens/jwt/errors/JWTTokensError";
import { PokemonIdError } from "../../../../../domain/entities/pokemonId/errors/pokemonIdError/pokemonIdError";
import { UserIdError } from "../../../../../domain/entities/userId/errors/userId/userIdErrors";
import { PokemonAbilitiesError } from "../../../../../domain/value objects/pokemonAbilities/errors/pokemonAbilitiesErrors/pokemonAbilitiesError";
import { PokemonHeightError } from "../../../../../domain/value objects/pokemonHeight/errors/pokemonHeight/pokemonHeightError";
import { PokemonMovesError } from "../../../../../domain/value objects/pokemonMoves/errors/pokemonMovesError/pokemonMovesError";
import { PokemonNameError } from "../../../../../domain/value objects/pokemonName/errors/pokemonNameErrors/pokemonNameErrors";
import { PokemonStatsError } from "../../../../../domain/value objects/pokemonStats/errors/pokemonStatsError/pokemonStatsError";
import { PokemonTypesError } from "../../../../../domain/value objects/pokemonTypes/errors/pokemonTypesError/pokemonTypesError";
import { PokemonWeightError } from "../../../../../domain/value objects/pokemonWeight/errors/pokemonWeight/pokemonWeightError";
import { UserAgeError } from "../../../../../domain/value objects/userAge/errors/userAge/userAgeError";
import { UserNameError } from "../../../../../domain/value objects/userName/errors/userName/userNameError";
import { UserPasswordError } from "../../../../../domain/value objects/userPassword/errors/userPasswordError/userPasswordError";

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
				if (
					err instanceof UserNameError ||
					err instanceof UserAgeError ||
					err instanceof UserIdError ||
					err instanceof UserPasswordError ||
					err instanceof PokemonIdError ||
					err instanceof PokemonNameError ||
					err instanceof PokemonHeightError ||
					err instanceof PokemonWeightError ||
					err instanceof PokemonAbilitiesError ||
					err instanceof PokemonMovesError ||
					err instanceof PokemonTypesError ||
					err instanceof PokemonStatsError ||
					err instanceof JWTTokensError
				) {
					this.logger.error(err);
					return res.status(400).json({
						message: err.message,
					});
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
