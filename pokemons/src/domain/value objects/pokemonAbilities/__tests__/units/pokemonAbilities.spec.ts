import type { Ability } from "../../../../entities/pokemon/types/pokemon";
import { PokemonAbilities } from "../../pokemonAbilities";

describe("PokemonAbilities", () => {
	// HAPPY PATH
	it("Should successfully return {abilities: [{name: 'Programming with Typescript'}]} when [name] is valid", () => {
		const pokemonAbilities = new PokemonAbilities([
			{ name: "Programming with Typescript" },
		]);
		const expected = {
			abilities: [{ name: "Programming with Typescript" }],
		};

		expect(pokemonAbilities).toEqual(expected);
	});

	//UNHAPPY PATH
	it("Should throw an error with message [Invalid abilities. It must be a non-empty array] if [abilities] is not an array", () => {
		const expectedErrorMessage =
			"Invalid abilities. It must be a non-empty array";
		const invalidAbilityName = { name: "not a valid ability" } as unknown;
		const invalidPokemonAbilities = () => {
			new PokemonAbilities(invalidAbilityName as { name: string }[]);
		};

		expect(invalidPokemonAbilities).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid abilities. It must be a non-empty array] if [abilities] is an array with 0 length", () => {
		const expectedErrorMessage =
			"Invalid abilities. It must be a non-empty array";
		const invalidAbilityName = [] as unknown;
		const invalidPokemonAbilities = () => {
			new PokemonAbilities(invalidAbilityName as { name: string }[]);
		};

		expect(invalidPokemonAbilities).toThrow(expectedErrorMessage);
	});

	it("Should throw an error for wrong type. When [name] type is [number], throw with message [Invalid ability name. It must be a string, but received type: number]", () => {
		const expectedErrorMessage =
			"Invalid ability name. It must be a string, but received type: number";
		const invalidAbilityName = [{ name: 123 }] as unknown;
		const invalidPokemonAbilities = () => {
			new PokemonAbilities(invalidAbilityName as { name: string }[]);
		};

		expect(invalidPokemonAbilities).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid ability name. It must be a string, but received type: undefined] for empty [name]", () => {
		const expectedErrorMessage =
			"Invalid ability name. It must be a string, but received type: undefined";
		const invalidPokemonAbilities = () => {
			new PokemonAbilities([{}] as Ability[]);
		};

		expect(invalidPokemonAbilities).toThrow(expectedErrorMessage);
	});
});
