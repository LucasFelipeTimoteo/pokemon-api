import type { logger } from "../../../application/logger/logger";
import { appEnv } from "../../../global/utils/env/appEnv/appEnv";
import { GracefullShutdownStrategyExecutor } from "../utils/gracefullShutdown/gracefullShutdownHandler";
import { gracefullShutdownHandlerClientSelector } from "../utils/gracefullShutdown/strategies/gracefullShutdownHandlerClientSelector";
import type { ExpressApp } from "./app/app";
import type {
	EntrypointCacheDatabaseClients,
	EntrypointDatabaseClients,
	HttpServer,
} from "./types/entrypoint/entrypointTypes";

export class ExpressEntryPoint {
	server: HttpServer | null = null;
	port = appEnv.appPort;
	listenMessage = `Running server on port ${this.port}`;
	gracefullShutdownSigs: NodeJS.Signals[] = ["SIGTERM", "SIGINT"];

	constructor(
		private app: ExpressApp,
		private logger: logger,
		private mainDatabase: EntrypointDatabaseClients,
		private cacheDatabase: EntrypointCacheDatabaseClients,
	) {}

	async listen() {
		const { "0": mainDatabase, "1": cacheDatabase } =
			await this.#startDatabases(this.mainDatabase, this.cacheDatabase);
		const app = this.#configApp();
		const server = app.listen(this.port, () =>
			this.logger.info(this.listenMessage),
		);

		this.server = server;
		this.gracefullShutdown(cacheDatabase, mainDatabase, server);
	}

	#configApp() {
		return this.app.exec();
	}

	async #startDatabases(
		dbClient: EntrypointDatabaseClients,
		cacheClient: EntrypointCacheDatabaseClients,
	) {
		type DatabaseClientOrder = [
			EntrypointDatabaseClients,
			EntrypointCacheDatabaseClients,
		];
		const databaseClients: DatabaseClientOrder = [dbClient, cacheClient];
		return await Promise.all(databaseClients);
	}

	async gracefullShutdown(
		cacheDatabase: Awaited<EntrypointCacheDatabaseClients>,
		mainDatabase: Awaited<EntrypointDatabaseClients>,
		server: HttpServer,
	) {
		const mainDataBaseseClientStrategy =
			await gracefullShutdownHandlerClientSelector("mongoose", mainDatabase);

		const cachedatabaseClientStrategy =
			await gracefullShutdownHandlerClientSelector("redis", cacheDatabase);

		const databaseClientShutdown = new GracefullShutdownStrategyExecutor(
			mainDataBaseseClientStrategy,
		);

		const cacheDatabaseClientShutdown = new GracefullShutdownStrategyExecutor(
			cachedatabaseClientStrategy,
		);

		for (const signal of this.gracefullShutdownSigs) {
			process.on(signal, async () =>
				server.close(() => {
					databaseClientShutdown.exec();
					cacheDatabaseClientShutdown.exec();

					this.logger.info("Gracefully close server");
					process.exit(0);
				}),
			);
		}
	}
}
