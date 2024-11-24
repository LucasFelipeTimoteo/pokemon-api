import type { logger } from "../../../application/logger/logger";
import { appEnv } from "../../../global/utils/env/appEnv";
import { GracefullShutdownStrategyExecutor } from "../utils/gracefullShutdown/gracefullShutdownHandler";
import { gracefullShutdownHandlerClientSelector } from "../utils/gracefullShutdown/strategies/gracefullShutdownHandlerClientSelector";
import type { ExpressApp } from "./app/app";
import type {
	EntrypointCacheDatabaseClients,
	HttpServer,
} from "./types/entrypoint/entrypointTypes";

export class ExpressEntryPoint {
	server: HttpServer | null = null;
	port = appEnv.appPort;
	listenMessage = `Running server on port ${this.port}`;
	gracefullShutdownSigs: NodeJS.Signals[] = ["SIGTERM", "SIGINT"];

	constructor(
		private app: ExpressApp,
		private cacheDatabase: EntrypointCacheDatabaseClients,
		private logger: logger,
	) {}

	async listen() {
		const { "0": cacheDatabase } = await this.#startDatabases(
			this.cacheDatabase,
		);
		const app = await this.#configApp();

		const server = app.listen(this.port, () =>
			this.logger.info(this.listenMessage),
		);
		this.server = server;
		this.gracefullShutdown(cacheDatabase, server);
	}

	async #configApp() {
		return this.app.exec();
	}

	async #startDatabases(cacheClient: EntrypointCacheDatabaseClients) {
		type DatabaseClientOrder = [EntrypointCacheDatabaseClients];
		const databaseClients: DatabaseClientOrder = [cacheClient];
		return await Promise.all(databaseClients);
	}

	async gracefullShutdown(
		cacheClient: Awaited<EntrypointCacheDatabaseClients>,
		server: HttpServer,
	) {
		const cacheClientStrategy = await gracefullShutdownHandlerClientSelector(
			"redis",
			cacheClient,
		);

		const cacheClientShutdown = new GracefullShutdownStrategyExecutor(
			cacheClientStrategy,
		);

		for (const signal of this.gracefullShutdownSigs) {
			process.on(signal, async () =>
				server.close(() => {
					cacheClientShutdown.exec();

					this.logger.info("Gracefully close server");
					process.exit(0);
				}),
			);
		}
	}
}
