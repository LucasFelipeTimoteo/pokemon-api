import pokemon from "../../../../../global/fixtures/pokemon/pokemon.json";
import rawPokemonDetais from "../../../../../global/fixtures/pokemon/rawPokemonDetails.json";
import { pokemonParser } from "../../pokemonParser";

describe("PokemonParser", () => {
	it("parseRawPokemonDetailsToPokemon should parse rawPokemonDetais to valid pokemon", () => {
		const parsedPokemon =
			pokemonParser.parseRawPokemonDetailsToPokemon(rawPokemonDetais);

		expect(parsedPokemon).toEqual(pokemon);
	});
});
