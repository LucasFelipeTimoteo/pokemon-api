import { Schema } from "mongoose";
import type { User } from "../../../../../domain/entities/user/types/user";
import { pokemonSchema } from "./pokemonSchema";

export const usersSchemaMongoose = new Schema<User>({
	username: {
		type: "string",
		required: true,
		minlength: 2,
		maxlength: 30,
		match: /^[a-zA-Z0-9]+$/,
		unique: true,
	},
	age: { type: "number", required: true, min: 6, max: 200 },
	password: { type: "string", required: true, min: 1 },
	pokemons: [pokemonSchema],
});

export type UsersSchemaMongoose = typeof usersSchemaMongoose;
