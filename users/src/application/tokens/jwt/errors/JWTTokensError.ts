export class JWTTokensError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "JWTTokensError";
	}
}
