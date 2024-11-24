import { protectInstance } from "../../utils/protectInstance/protectinstance";
import { PokemonAbilities } from "../../value objects/pokemonAbilities/pokemonAbilities";
import { PokemonHeight } from "../../value objects/pokemonHeight/pokemonHeight";
import { PokemonMoves } from "../../value objects/pokemonMoves/pokemonMoves";
import { PokemonName } from "../../value objects/pokemonName/pokemonName";
import { PokemonStats } from "../../value objects/pokemonStats/pokemonStats";
import { PokemonTypes } from "../../value objects/pokemonTypes/pokemonTypes";
import { PokemonWeight } from "../../value objects/pokemonWeight/pokemonWeight";
import { PokemonIdEntity } from "../pokemonId/pokemonIdEntity";
import type { Ability, Move, Pokemon, Stat, Type } from "./types/pokemon";

export class PokemonEntity implements Pokemon {
	constructor(
		public pokemon_id: number,
		public name: string,
		public height: number,
		public weight: number,
		public abilities: Ability[],
		public moves: Move[],
		public types: Type[],
		public stats: Stat[],
	) {
		this.pokemon_id = new PokemonIdEntity(pokemon_id).pokemon_id;
		this.name = new PokemonName(name).name;
		this.height = new PokemonHeight(height).height;
		this.weight = new PokemonWeight(weight).weight;
		this.abilities = new PokemonAbilities(abilities).abilities;
		this.moves = new PokemonMoves(moves).moves;
		this.types = new PokemonTypes(types).types;
		this.stats = new PokemonStats(stats).stats;

		protectInstance(this, true);
	}
}
