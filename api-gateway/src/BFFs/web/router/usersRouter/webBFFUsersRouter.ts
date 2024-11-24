import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";
import { appEnv } from "../../../../global/env/utils/appEnv/appEnv";
import {
	type AuthMiddlewareExpressResquest,
	authMiddleware,
} from "../../../../middlewares/auth/auth";

export class WebBFFUsersRouter {
	basePath = "/users";
	router = Router();

	async exec() {
		this.router.post(
			this.basePath,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: fixRequestBody,
				},
			}),
		);

		this.router.patch(
			this.basePath,
			authMiddleware,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: (proxyReq, req: AuthMiddlewareExpressResquest, res) => {
						if (req.body && req.user?.userId) {
							req.body.userId = req.user.userId;

							const bodyData = JSON.stringify(req.body);
							proxyReq.setHeader("Content-Type", "application/json");
							proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
							proxyReq.write(bodyData);
							proxyReq.end();
						}
					},
				},
			}),
		);

		this.router.post(
			`${this.basePath}/login`,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: fixRequestBody,
				},
			}),
		);

		this.router.patch(
			`${this.basePath}/password`,
			authMiddleware,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: (proxyReq, req: AuthMiddlewareExpressResquest, res) => {
						if (req.body && req.user?.userId) {
							req.body.userId = req.user.userId;

							const bodyData = JSON.stringify(req.body);
							proxyReq.setHeader("Content-Type", "application/json");
							proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
							proxyReq.write(bodyData);
							proxyReq.end();
						}
					},
				},
			}),
		);

		this.router.post(
			`${this.basePath}/pokemons`,
			authMiddleware,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: (proxyReq, req: AuthMiddlewareExpressResquest, res) => {
						if (req.body && req.user?.userId) {
							req.body.userId = req.user.userId;

							const bodyData = JSON.stringify(req.body);
							proxyReq.setHeader("Content-Type", "application/json");
							proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
							proxyReq.write(bodyData);
							proxyReq.end();
						}
					},
				},
			}),
		);

		this.router.get(
			`${this.basePath}/pokemons`,
			authMiddleware,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: (proxyReq, req: AuthMiddlewareExpressResquest, res) => {
						const userId = req.user?.userId;
						const newPath = `${this.basePath}/pokemons/${userId}`;
						proxyReq.path = newPath;
					},
				},
			}),
		);

		this.router.delete(
			`${this.basePath}/pokemons/:pokemonId`,
			authMiddleware,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: (proxyReq, req: AuthMiddlewareExpressResquest, res) => {
						const pokemonId = req.params.pokemonId;
						const userId = req.user?.userId;
						const newPath = `${this.basePath}/pokemons/${userId}/${pokemonId}`;
						proxyReq.path = newPath;
					},
				},
			}),
		);

		this.router.post(
			`${this.basePath}/token/refresh`,
			createProxyMiddleware({
				target: `http://${appEnv.usersServiceHost}:${appEnv.usersServicePort}`,
				changeOrigin: true,
				on: {
					proxyReq: fixRequestBody,
				},
			}),
		);
		return this.router;
	}
}
