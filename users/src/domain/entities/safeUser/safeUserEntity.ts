import { protectInstance } from "../../utils/protectInstance/protectinstance";
import { UserAge } from "../../value objects/userAge/userAge";
import { UserName } from "../../value objects/userName/userName";
import { PokemonEntity } from "../pokemon/pokemonEntity";
import type { Pokemon } from "../pokemon/types/pokemon";
import { UserIdEntity } from "../userId/userIdEntity";

export class SafeUserEntity {
	constructor(
		public userId: string,
		public username: string,
		public age: number,
		public pokemons: Pokemon[] = [],
	) {
		this.userId = new UserIdEntity(userId).userId;
		this.username = new UserName(username).username;
		this.age = new UserAge(age).age;
		this.pokemons = pokemons.map(
			(pokemon) =>
				new PokemonEntity(
					pokemon.pokemon_id,
					pokemon.name,
					pokemon.height,
					pokemon.weight,
					pokemon.abilities,
					pokemon.moves,
					pokemon.types,
					pokemon.stats,
				),
		);

		protectInstance(this, true);
	}
}
