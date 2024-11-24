import axios, { type AxiosInstance } from "axios";
import { HttpResponseStatuses } from "../../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import type { PokemonHttpClient } from "../../../../application/clients/http/pokemon/types/pokemonHttpClient";
import type { RawPokemonDetails } from "../../../../application/clients/http/pokemon/types/rawPokemonDetails";
import type { RawPokemons } from "../../../../application/clients/http/pokemon/types/rawPokemons";
import { ApiError } from "../../../../application/errors/api/apiError";
import type { logger } from "../../../../application/logger/logger";
import type {
	PokemonValidator,
	PokemonValidatorResponse,
	PokemonValidatorResponseError,
	PokemonValidatorResponseSuccess,
} from "../../../../application/validation/pokemon/pokemonValidator";

export class PokemonAxiosHttpClient implements PokemonHttpClient {
	apiBaseUrl = "https://pokeapi.co/api/v2";
	apiPokemonUrl: string;
	#pokemonHttpClient: AxiosInstance;

	constructor(
		private pokemonValidator: PokemonValidator<unknown>,
		private logger: logger,
	) {
		this.apiPokemonUrl = `${this.apiBaseUrl}/pokemon`;

		this.#pokemonHttpClient = axios.create({
			method: "GET",
			baseURL: this.apiPokemonUrl,
		});
	}

	async getOne(
		pokemonId: number,
	): Promise<PokemonValidatorResponse<RawPokemonDetails, unknown>> {
		try {
			const rawPokemonDetailsResponse = await this.#pokemonHttpClient(
				`/${pokemonId}`,
			);
			const unvalidatedRawPokemonDetails = rawPokemonDetailsResponse.data;
			const validatedRawPokemonDetails =
				this.pokemonValidator.rawPokemonDetails(unvalidatedRawPokemonDetails);

			this.logger.debug(
				"Successfully fetched a valid rawPokemonDetails from api",
			);

			return validatedRawPokemonDetails;
		} catch (error) {
			if (!(error instanceof Error)) {
				throw error;
			}

			if (error.message.includes("404")) {
				throw new ApiError(
					`Cannot find a pokemon with provided id. Received [id: ${pokemonId}]`,
					HttpResponseStatuses.notFound,
					true,
				);
			}

			throw error;
		}
	}

	async getAll(): Promise<
		| PokemonValidatorResponseError<unknown>[]
		| PokemonValidatorResponseSuccess<RawPokemonDetails>[]
	> {
		try {
			const rawPokemonsResponse = await this.#fetchRawPokemons();
			const rawPokemonDetailsList = await this.#fetchRawPokemonDetailsList(
				rawPokemonsResponse.data,
			);

			this.logger.debug("Successfully fetched valid rawPokemons from api");

			return rawPokemonDetailsList;
		} catch (error) {
			if (error instanceof Error) {
				throw new ApiError(error.message);
			}

			throw error;
		}
	}

	async #fetchRawPokemons() {
		const limit = 1025;
		const getAllUrl = `/?limit=${limit}`;
		const rawPokemonsResponse = await this.#pokemonHttpClient(getAllUrl);
		const validateRawPokemons = this.pokemonValidator.rawPokemons(
			rawPokemonsResponse.data,
		);

		if (validateRawPokemons.success) {
			const rawPokemons = validateRawPokemons.data;
			const sucessResponse: PokemonValidatorResponseSuccess<RawPokemons> = {
				data: rawPokemons,
				success: true,
			};

			return sucessResponse;
		}

		throw new ApiError(
			"Received rawPokemons from external API does't match correct interface",
		);
	}

	async #fetchRawPokemonDetailsList(rawPokemons: RawPokemons) {
		const rawPokemonDetailsListPromise = rawPokemons.results.map(
			(currentRawPokemon) =>
				this.#pokemonHttpClient({ baseURL: currentRawPokemon.url }),
		);
		const rawPokemonDetailsList = await Promise.all(
			rawPokemonDetailsListPromise,
		);

		const validatedRawPokemonDetailsList = [];
		const invalidRawPokemonDetailsList = [];

		for (const rawPokemonDetails of rawPokemonDetailsList) {
			const validatedRawPokemonDetails =
				this.pokemonValidator.rawPokemonDetails(rawPokemonDetails.data);

			if (validatedRawPokemonDetails.success) {
				validatedRawPokemonDetailsList.push(validatedRawPokemonDetails);
			} else {
				invalidRawPokemonDetailsList.push(validatedRawPokemonDetails);
			}
		}
		if (invalidRawPokemonDetailsList.length > 0) {
			return invalidRawPokemonDetailsList;
		}

		return validatedRawPokemonDetailsList;
	}
}
