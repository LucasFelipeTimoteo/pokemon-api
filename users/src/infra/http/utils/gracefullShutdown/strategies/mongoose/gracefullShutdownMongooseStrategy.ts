import type { MongooseClient } from "../../../../../services/db/mongoose/types/mongooseTypes";
import type { GracefullShutdownHandlerStrategyType } from "../../types/gracefullShutdownHandlerStrategy";

export class GracefullShutdownMongooseStrategy
	implements GracefullShutdownHandlerStrategyType
{
	constructor(private mongooseClient: MongooseClient) {}

	async exec() {
		this.mongooseClient.disconnect();

		return true;
	}
}
