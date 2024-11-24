import type { UserToken } from "../../../infra/tokens/jwt/jsonWebTokenLib/JWTTokensByJsonWebTokenLib";

export interface JWTTokens {
	genToken(
		payload: string | Buffer | object,
		secret: string,
		ttl?: number,
	): string;
	verifyToken(token: string, secret: string): string | object;
	decodeToken(token: string): UserToken;
}
