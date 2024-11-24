import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { appEnv } from "../../../../global/env/utils/appEnv/appEnv";
import { authMiddleware } from "../../../../middlewares/auth/auth";

export class WebBFFPokemonRouter {
	basePath = "/pokemons";
	router = Router();

	async exec() {
		this.router.get(
			this.basePath,
			authMiddleware,
			createProxyMiddleware({
				target: `http://${appEnv.pokemonServiceHost}:${appEnv.pokemonServicePort}`,
				changeOrigin: true,
			}),
		);

		this.router.get(
			`${this.basePath}/:pokemonId`,
			authMiddleware,
			createProxyMiddleware({
				target: `http://${appEnv.pokemonServiceHost}:${appEnv.pokemonServicePort}`,
				changeOrigin: true,
			}),
		);

		return this.router;
	}
}
