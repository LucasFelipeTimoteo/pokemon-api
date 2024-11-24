import jwt from "jsonwebtoken";
import type { JWTTokens } from "../../../../application/tokens/jwt/JWTTokens";
import { JWTTokensError } from "../../../../application/tokens/jwt/errors/JWTTokensError";

export type UserToken = {
	userId: string;
};

export class JWTTokensByJsonWebTokenLib implements JWTTokens {
	genToken(
		payload: string | Buffer | object,
		secret: string,
		ttl?: number,
	): string {
		const token = jwt.sign(payload, secret, { expiresIn: ttl });

		return token;
	}

	verifyToken(token: string, secret: string) {
		try {
			const isTokenCorrect = jwt.verify(token, secret);
			return isTokenCorrect;
		} catch (error) {
			throw new JWTTokensError("Fail to verify token. Invalid token");
		}
	}

	decodeToken(token: string): UserToken {
		const decodedToken = jwt.decode(token);

		if (this.#isUserToken(decodedToken)) {
			return decodedToken;
		}

		throw new JWTTokensError("Invalid Token. Cannot be decoded");
	}

	#isUserToken(decodedToken: unknown): decodedToken is UserToken {
		if (
			typeof decodedToken === "object" &&
			decodedToken !== null &&
			typeof (decodedToken as UserToken).userId === "string"
		) {
			return true;
		}

		return false;
	}
}
