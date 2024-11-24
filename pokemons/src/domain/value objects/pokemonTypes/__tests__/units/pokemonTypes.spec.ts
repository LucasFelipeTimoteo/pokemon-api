import type { Type } from "../../../../entities/pokemon/types/pokemon";
import { PokemonTypes } from "../../pokemonTypes";

describe("PokemonTypes", () => {
	// HAPPY PATH
	it("Should successfully return {type: [{name: Typescript'}]} when [name] is valid", () => {
		const pokemonTypes = new PokemonTypes([{ name: "Typescript" }]);
		const expected = {
			types: [{ name: "Typescript" }],
		};

		expect(pokemonTypes).toEqual(expected);
	});

	// //UNHAPPY PATH
	it("Should throw an error with message [Invalid types. It must be a non-empty array] if [types] is not an array", () => {
		const expectedErrorMessage = "Invalid types. It must be a non-empty array";
		const invalidTypeName = { name: "not a valid type" } as unknown;
		const invalidPokemonTypes = () => {
			new PokemonTypes(invalidTypeName as { name: string }[]);
		};

		expect(invalidPokemonTypes).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid types. It must be a non-empty array] if [types] is an array with 0 length", () => {
		const expectedErrorMessage = "Invalid types. It must be a non-empty array";
		const invalidTypeName = [] as unknown;
		const invalidPokemonTypes = () => {
			new PokemonTypes(invalidTypeName as { name: string }[]);
		};

		expect(invalidPokemonTypes).toThrow(expectedErrorMessage);
	});

	it("Should throw an error for wrong type. When [name] type is [number], throw with message [Invalid type name. It must be a string, but received type: number]", () => {
		const expectedErrorMessage =
			"Invalid type name. It must be a string, but received type: number";
		const invalidTypeName = [{ name: 123 }] as unknown;
		const invalidPokemonTypes = () => {
			new PokemonTypes(invalidTypeName as { name: string }[]);
		};

		expect(invalidPokemonTypes).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid type name. It must be a string, but received type: undefined] for empty [name]", () => {
		const expectedErrorMessage =
			"Invalid type name. It must be a string, but received type: undefined";
		const invalidPokemonTypes = () => {
			new PokemonTypes([{}] as Type[]);
		};

		expect(invalidPokemonTypes).toThrow(expectedErrorMessage);
	});
});
