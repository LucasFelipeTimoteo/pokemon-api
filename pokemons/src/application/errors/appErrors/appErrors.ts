import type { ApiError } from "../api/apiError";
import type { ApiValidationError } from "../apiValidation/apiValidationError";
import type { ServerError } from "../server/serverError";

export type appErrors = Error | ServerError | ApiError | ApiValidationError;
