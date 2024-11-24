import { PokemonIdEntity } from "../../pokemonIdEntity";

describe("pokemonIdEntity", () => {
	// HAPPY PATH
	it("Should successfully return { pokemon_id: receivedNumber } when a number greater than 0 like 1 is provided", () => {
		const receivedNumber = 1;
		const expected = { pokemon_id: receivedNumber };
		const pokemonId = new PokemonIdEntity(receivedNumber);

		expect(pokemonId).toEqual(expected);
	});

	// UNHAPPY PATH
	it("Should throw an error with message [Invalid pokemon_id. It must be a number greather than 0, but received: -1] when the number -1 is provided", () => {
		const receivedNumber = -1;
		const expectedErrormessage =
			"Invalid pokemon_id. It must be a number greather than 0, but received: -1";
		const expectedError = () => new PokemonIdEntity(receivedNumber);

		expect(expectedError).toThrow(expectedErrormessage);
	});

	it("Should throw an error with message [Invalid pokemon_id. It must be a number, but received type: string] when the number -1 is provided", () => {
		const receivedNumber = "1" as unknown;
		const expectedErrormessage =
			"Invalid pokemon_id. It must be a number, but received type: string";
		const expectedError = () => new PokemonIdEntity(receivedNumber as number);

		expect(expectedError).toThrow(expectedErrormessage);
	});
});
