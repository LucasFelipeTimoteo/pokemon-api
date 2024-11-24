import pokemon from "../../../../../../global/fixtures/pokemon/pokemon.json";
import rawPokemonDetails from "../../../../../../global/fixtures/pokemon/rawPokemonDetails.json";
import rawPokemons from "../../../../../../global/fixtures/pokemon/rawPokemons.json";
import { zodPokemonValidator } from "../../zodPokemonValidator";

describe("ZodPokemonValidator", () => {
	describe("pokemon", () => {
		// HAPPY PATH
		it("Should have a property [success] with the value [true] when data is valid", () => {
			const validatedPokemon = zodPokemonValidator.pokemon(pokemon);

			expect(validatedPokemon.success).toBe(true);
		});

		it("Should not have a prop [error] when data is valid", () => {
			const validatedPokemon = zodPokemonValidator.pokemon(pokemon);

			expect(validatedPokemon).not.toHaveProperty("error");
		});

		it("Should have a prop [data] with valid pokemon when data is valid", () => {
			const validatedPokemon = zodPokemonValidator.pokemon(pokemon);

			expect(validatedPokemon.data).toEqual(pokemon);
		});

		// UNHAPPY PATH
		it("Should have a property [success] with the value [false] when data is invalid", () => {
			const invalidPokemon = {
				...pokemon,
				name: "",
			};
			const validatedPokemon = zodPokemonValidator.pokemon(invalidPokemon);

			expect(validatedPokemon.success).toBe(false);
		});

		it("Should have a prop [error] when data is invalid", () => {
			const invalidPokemon = {
				...pokemon,
				name: "",
			};
			const validatedPokemon = zodPokemonValidator.pokemon(invalidPokemon);

			expect(validatedPokemon).toHaveProperty("error");
		});

		it("Should have a prop [error] with error value that have prop [code] equals [too_small]", () => {
			const invalidPokemon = {
				...pokemon,
				name: "",
			};
			const validatedPokemon = zodPokemonValidator.pokemon(invalidPokemon);

			expect(validatedPokemon.error?.errors[0].code).toBe("too_small");
		});

		it("Should have a prop [error] with error value that have prop [message] equals [String must contain at least 1 character(s)]", () => {
			const invalidPokemon = {
				...pokemon,
				name: "",
			};
			const validatedPokemon = zodPokemonValidator.pokemon(invalidPokemon);

			expect(validatedPokemon.error?.errors[0].message).toBe(
				"String must contain at least 1 character(s)",
			);
		});
	});

	describe("rawPokemons", () => {
		// HAPPY PATH
		it("Should have a property [success] with the value [true] when data is valid", () => {
			const validatedRawPokemons = zodPokemonValidator.rawPokemons(rawPokemons);

			expect(validatedRawPokemons.success).toBe(true);
		});

		it("Should not have a prop [error] when data is valid", () => {
			const validatedRawPokemons = zodPokemonValidator.rawPokemons(rawPokemons);

			expect(validatedRawPokemons).not.toHaveProperty("error");
		});

		it("Should have a prop [data] with valid rawPokemons when data is valid", () => {
			const validatedRawPokemons = zodPokemonValidator.rawPokemons(rawPokemons);

			expect(validatedRawPokemons.data).toEqual(rawPokemons);
		});

		// UNHAPPY PATH
		it("Should have a property [success] with the value [false] when data is invalid", () => {
			const invalidRawPokemons = {
				...rawPokemons,
				count: { message: "this is invalid" },
			};
			const validatedRawPokemons =
				zodPokemonValidator.rawPokemons(invalidRawPokemons);

			expect(validatedRawPokemons.success).toBe(false);
		});

		it("Should have a prop [error] when data is invalid", () => {
			const invalidRawPokemons = {
				...rawPokemons,
				count: { message: "this is invalid" },
			};
			const validatedRawPokemons =
				zodPokemonValidator.rawPokemons(invalidRawPokemons);

			expect(validatedRawPokemons).toHaveProperty("error");
		});

		it("Should have a prop [error] with error value that have prop [code] equals [invalid_type] when data is invalid", () => {
			const invalidRawPokemons = {
				...rawPokemons,
				count: { message: "this is invalid" },
			};
			const validatedRawPokemons =
				zodPokemonValidator.rawPokemons(invalidRawPokemons);

			expect(validatedRawPokemons.error?.errors[0].code).toBe("invalid_type");
		});

		it("Should have a prop [error] with error value that have prop [message] equals [Expected number, received object] when data is invalid", () => {
			const invalidRawPokemons = {
				...rawPokemons,
				count: { message: "this is invalid" },
			};
			const validatedRawPokemons =
				zodPokemonValidator.rawPokemons(invalidRawPokemons);

			expect(validatedRawPokemons.error?.errors[0].message).toBe(
				"Expected number, received object",
			);
		});
	});

	describe("rawPokemonDetails", () => {
		// HAPPY PATH
		it("Should have a property [success] with the value [true] when data is valid", () => {
			const validatedRawPokemondetails =
				zodPokemonValidator.rawPokemonDetails(rawPokemonDetails);

			expect(validatedRawPokemondetails.success).toBe(true);
		});

		it("Should not have a prop [error] when data is valid", () => {
			const validatedRawPokemonDetails =
				zodPokemonValidator.rawPokemonDetails(rawPokemonDetails);

			expect(validatedRawPokemonDetails).not.toHaveProperty("error");
		});

		it("Should have a prop [data] with valid rawPokemons when data is valid", () => {
			const validatedRawPokemonDetails =
				zodPokemonValidator.rawPokemonDetails(rawPokemonDetails);

			expect(rawPokemonDetails).toMatchObject(validatedRawPokemonDetails.data!);
		});
		// UNHAPPY PATH
		it("Should have a property [success] with the value [false] when data is invalid", () => {
			const invalidRawPokemonDetails = {
				...rawPokemonDetails,
				name: 123,
			};
			const validatedRawPokemons = zodPokemonValidator.rawPokemonDetails(
				invalidRawPokemonDetails,
			);

			expect(validatedRawPokemons.success).toBe(false);
		});

		it("Should have a prop [error] when data is invalid", () => {
			const invalidRawPokemonDetails = {
				...rawPokemonDetails,
				name: 123,
			};
			const validatedRawPokemons = zodPokemonValidator.rawPokemonDetails(
				invalidRawPokemonDetails,
			);

			expect(validatedRawPokemons).toHaveProperty("error");
		});

		it("Should have a prop [error] with error value that have prop [code] equals [invalid_type] when data is invalid", () => {
			const invalidRawPokemonDetails = {
				...rawPokemonDetails,
				name: 123,
			};
			const validatedRawPokemons = zodPokemonValidator.rawPokemonDetails(
				invalidRawPokemonDetails,
			);

			expect(validatedRawPokemons.error?.errors[0].code).toBe("invalid_type");
		});

		it("Should have a prop [error] with error value that have prop [message] equals [Expected string, received number] when data is invalid", () => {
			const invalidRawPokemonDetails = {
				...rawPokemonDetails,
				name: 123,
			};
			const validatedRawPokemons = zodPokemonValidator.rawPokemonDetails(
				invalidRawPokemonDetails,
			);

			expect(validatedRawPokemons.error?.errors[0].message).toBe(
				"Expected string, received number",
			);
		});
	});
});
