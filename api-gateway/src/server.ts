import cors from "cors";
import express from "express";
import helmet from "helmet";
import type { WebBFFPokemonRouter } from "./BFFs/web/router/pokemons/webBFFPokemonRouter";
import type { WebBFFUsersRouter } from "./BFFs/web/router/usersRouter/webBFFUsersRouter";
import { healthRouter } from "./health/router/health";
import { rateLimitMiddleware } from "./middlewares/rateLimit/rateLimit";

export class Server {
	constructor(
		private webBFFPokemonRouter: WebBFFPokemonRouter,
		private webBFFUsersRouter: WebBFFUsersRouter,
	) {}
	app = express();

	async exec() {
		const pokemonRouter = await this.webBFFPokemonRouter.exec();
		const usersRouter = await this.webBFFUsersRouter.exec();
		this.app.use(express.json());
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(rateLimitMiddleware);
		this.app.use(healthRouter);
		this.app.use(usersRouter);
		this.app.use(pokemonRouter);

		return this.app;
	}
}
