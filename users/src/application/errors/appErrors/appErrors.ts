import type { PokemonIdError } from "../../../domain/entities/pokemonId/errors/pokemonIdError/pokemonIdError";
import type { UserIdError } from "../../../domain/entities/userId/errors/userId/userIdErrors";
import type { PokemonAbilitiesError } from "../../../domain/value objects/pokemonAbilities/errors/pokemonAbilitiesErrors/pokemonAbilitiesError";
import type { PokemonHeightError } from "../../../domain/value objects/pokemonHeight/errors/pokemonHeight/pokemonHeightError";
import type { PokemonMovesError } from "../../../domain/value objects/pokemonMoves/errors/pokemonMovesError/pokemonMovesError";
import type { PokemonNameError } from "../../../domain/value objects/pokemonName/errors/pokemonNameErrors/pokemonNameErrors";
import type { PokemonStatsError } from "../../../domain/value objects/pokemonStats/errors/pokemonStatsError/pokemonStatsError";
import type { PokemonTypesError } from "../../../domain/value objects/pokemonTypes/errors/pokemonTypesError/pokemonTypesError";
import type { PokemonWeightError } from "../../../domain/value objects/pokemonWeight/errors/pokemonWeight/pokemonWeightError";
import type { UserAgeError } from "../../../domain/value objects/userAge/errors/userAge/userAgeError";
import type { UserNameError } from "../../../domain/value objects/userName/errors/userName/userNameError";
import type { UserPasswordError } from "../../../domain/value objects/userPassword/errors/userPasswordError/userPasswordError";
import type { JWTTokensError } from "../../tokens/jwt/errors/JWTTokensError";
import type { ApiError } from "../api/apiError";
import type { ApiValidationError } from "../apiValidation/apiValidationError";
import type { ServerError } from "../server/serverError";

export type appErrors =
	| Error
	| ServerError
	| ApiError
	| ApiValidationError
	| UserNameError
	| UserAgeError
	| UserIdError
	| UserPasswordError
	| PokemonIdError
	| PokemonNameError
	| PokemonHeightError
	| PokemonWeightError
	| PokemonAbilitiesError
	| PokemonMovesError
	| PokemonTypesError
	| PokemonStatsError
	| JWTTokensError;
