import type { GracefullShutdownHandlerStrategyType } from "./types/gracefullShutdownHandlerStrategy";

export class GracefullShutdownStrategyExecutor {
	constructor(
		private databaseClientStrategy: GracefullShutdownHandlerStrategyType,
	) {}

	exec() {
		this.databaseClientStrategy.exec();
	}
}
