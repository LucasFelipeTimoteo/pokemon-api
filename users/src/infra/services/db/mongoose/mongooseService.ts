import { connect } from "mongoose";
import type { logger } from "../../../../application/logger/logger";
import { appEnv } from "../../../../global/utils/env/appEnv/appEnv";
import type { MongooseClient } from "./types/mongooseTypes";

export class MongooseService {
	connectionURI = `${appEnv.mongoUrl || "mongodb://127.0.0.1:27017"}/${this.dbName}`;
	#connection: Promise<MongooseClient>;
	#connectionOptions = {
		autoIndex: appEnv.nodeEnv !== "production",
	};

	constructor(
		private logger: logger,
		private dbName: string = appEnv.mongoDatabaseName,
	) {
		this.#connection = connect(this.connectionURI, this.#connectionOptions);
		this.connect = this.connect.bind(this);
	}

	async connect() {
		const mongoClient = await this.#connection;
		this.logger.info("Connected to Mongo by Mongoose");
		return mongoClient;
	}
}
