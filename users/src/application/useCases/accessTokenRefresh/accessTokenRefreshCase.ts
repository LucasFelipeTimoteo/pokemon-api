import { HttpResponseStatuses } from "../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import { appEnv } from "../../../global/utils/env/appEnv/appEnv";
import type { UserToken } from "../../../infra/tokens/jwt/jsonWebTokenLib/JWTTokensByJsonWebTokenLib";
import { ApiError } from "../../errors/api/apiError";
import type { logger } from "../../logger/logger";
import type { UsersCacheRepository } from "../../repository/usersCacheRepository";
import type { JWTTokens } from "../../tokens/jwt/JWTTokens";

export class AccessTokenRefreshCase {
	constructor(
		private usersCacherepository: UsersCacheRepository,
		private logger: logger,
		private JWTTokens: JWTTokens,
	) {}

	async refresh(accessToken: string, refreshToken: string): Promise<string> {
		const expiredDecodedToken = this.JWTTokens.decodeToken(accessToken);
		const refreshTokenExists =
			await this.usersCacherepository.refreshTokenIsValid(
				expiredDecodedToken.userId,
				refreshToken,
			);
		if (!refreshTokenExists) {
			const errorMsg = `Cannot generate new accessToken because a refreshToken for user [${expiredDecodedToken.userId}] does not exists`;
			throw new ApiError(errorMsg, HttpResponseStatuses.notFound, true);
		}

		const newTokenPayload: UserToken = {
			userId: expiredDecodedToken.userId,
		};
		const accessTokenTTL = Number(appEnv.accessTokenTTLMinutes) * 60;
		const newToken = this.JWTTokens.genToken(
			newTokenPayload,
			appEnv.accessTokenJwtSecret,
			accessTokenTTL,
		);

		this.logger.debug("Successfully generated a new accessToken");
		return newToken;
	}
}
