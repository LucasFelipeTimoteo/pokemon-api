export class ApiValidationError extends Error {
	constructor(
		message: string,
		public statusCode = 500,
		public operational = true,
		public debugMessage?: string,
		public docs?: string,
	) {
		super(message);
		this.name = "ApiValidationError";
		Error.captureStackTrace(this, this.constructor);
	}
}
