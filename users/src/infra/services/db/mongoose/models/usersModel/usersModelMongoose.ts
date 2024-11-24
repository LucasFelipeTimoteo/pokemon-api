import { model } from "mongoose";
import { appEnv } from "../../../../../../global/utils/env/appEnv/appEnv";
import { usersSchemaMongoose } from "../../schema/usersSchemaMongoose";

export const UsersModel = (
	mongoUsersCollection = appEnv.mongoUsersCollection,
	schema = usersSchemaMongoose,
) => model(mongoUsersCollection, schema);

export type UsersModelType = ReturnType<typeof UsersModel>;
