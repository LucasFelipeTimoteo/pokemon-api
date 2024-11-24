import { appEnv } from "./global/env/utils/appEnv/appEnv";
import type { logger } from "./global/logger/type/logger";
import type { Server } from "./server";

export class Entrypoint {
	runningMsg = `Running server on port ${appEnv.appPort}`;

	constructor(
		private server: Server,
		private logger: logger,
	) {}

	async listen() {
		const app = await this.server.exec();
		app.listen(3003, () => this.logger.info(this.runningMsg));
	}
}
