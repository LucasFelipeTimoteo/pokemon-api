import { Schema } from "mongoose";
import type { Pokemon } from "../../../../../domain/entities/pokemon/types/pokemon";

const abilitySchema = new Schema(
	{
		name: { type: String, required: true },
	},
	{ _id: false },
);

const moveSchema = new Schema(
	{
		name: { type: String, required: true },
	},
	{ _id: false },
);

const typeSchema = new Schema(
	{
		name: { type: String, required: true },
	},
	{ _id: false },
);

const statSchema = new Schema(
	{
		name: { type: String, required: true },
		base_stat: { type: Number, required: true },
		effort: { type: Number, required: true },
	},
	{ _id: false },
);

export const pokemonSchema = new Schema<Pokemon>(
	{
		pokemon_id: { type: Number, required: true },
		name: { type: String, required: true },
		height: { type: Number, required: true },
		weight: { type: Number, required: true },
		abilities: { type: [abilitySchema], required: true },
		moves: { type: [moveSchema], required: true },
		types: { type: [typeSchema], required: true },
		stats: { type: [statSchema], required: true },
	},
	{
		_id: false,
	},
);
