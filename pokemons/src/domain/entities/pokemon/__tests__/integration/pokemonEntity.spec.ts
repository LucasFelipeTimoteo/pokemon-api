import pokemonFixture from "../../../../../global/fixtures/pokemon/pokemon.json";
import { PokemonEntity } from "../../pokemonEntity";

let pokemonEntity: PokemonEntity;

beforeEach(() => {
	pokemonEntity = new PokemonEntity(
		pokemonFixture.pokemon_id,
		pokemonFixture.name,
		pokemonFixture.height,
		pokemonFixture.weight,
		pokemonFixture.abilities,
		pokemonFixture.moves,
		pokemonFixture.types,
		pokemonFixture.stats,
	);
});

describe("PokemonEntity", () => {
	// HAPPY PATH
	it("Should return a valid pokemon instance when all provided data is correct", () => {
		expect(pokemonEntity).toEqual(pokemonFixture);
	});

	it("Should return an instance that all properties are enumerable", () => {
		const expectedSubset = { enumerable: true };
		const pokemonIdDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"pokemon_id",
		);
		const pokemonNameDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"name",
		);
		const pokemonHeightDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"height",
		);
		const pokemonWeightDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"weight",
		);
		const pokemonAbilitiesDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"abilities",
		);
		const pokemonTypesDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"types",
		);
		const pokemonMovesDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"moves",
		);
		const pokemonStatsDescriptor = Object.getOwnPropertyDescriptor(
			pokemonEntity,
			"stats",
		);

		expect(pokemonIdDescriptor).toMatchObject(expectedSubset);
		expect(pokemonNameDescriptor).toMatchObject(expectedSubset);
		expect(pokemonHeightDescriptor).toMatchObject(expectedSubset);
		expect(pokemonWeightDescriptor).toMatchObject(expectedSubset);
		expect(pokemonAbilitiesDescriptor).toMatchObject(expectedSubset);
		expect(pokemonTypesDescriptor).toMatchObject(expectedSubset);
		expect(pokemonMovesDescriptor).toMatchObject(expectedSubset);
		expect(pokemonStatsDescriptor).toMatchObject(expectedSubset);
	});

	it("Should return a frozen instance", () => {
		expect(Object.isFrozen(pokemonEntity)).toBe(true);
	});
});
