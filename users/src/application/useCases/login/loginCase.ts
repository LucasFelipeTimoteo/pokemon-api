import { HttpResponseStatuses } from "../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import { appEnv } from "../../../global/utils/env/appEnv/appEnv";
import type { Aes256Cbc } from "../../crypto/simetric/aes/aes256Cbc/aes256cbc";
import { ApiError } from "../../errors/api/apiError";
import type { logger } from "../../logger/logger";
import type { UsersCacheRepository } from "../../repository/usersCacheRepository";
import type { UsersRepository } from "../../repository/usersRepository";
import type { JWTTokens } from "../../tokens/jwt/JWTTokens";

export class LoginCase {
	constructor(
		private usersRepository: UsersRepository,
		private usersCacheRepository: UsersCacheRepository,
		private logger: logger,
		private JWTTokens: JWTTokens,
		private aes256Cbc: Aes256Cbc,
	) {}

	async login(
		username: string,
		password: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const userObjId = await this.usersRepository.login(username, password);

		if (!userObjId) {
			this.logger.debug("Invalid login");
			throw new ApiError(
				"Invalid username or password",
				HttpResponseStatuses.badRequest,
				true,
			);
		}

		const accessTokenTTLInSeconds = Number(appEnv.accessTokenTTLMinutes) * 60;
		const refreshTokenTTLInSeconds =
			Number(appEnv.refreshTokenTTLDays) * 24 * 60 * 60;

		const tokenPayload = { userId: userObjId.userId };
		const accessToken = this.JWTTokens.genToken(
			tokenPayload,
			appEnv.accessTokenJwtSecret,
			accessTokenTTLInSeconds,
		);
		const refreshToken = this.JWTTokens.genToken(
			tokenPayload,
			appEnv.refreshTokenJwtSecret,
			refreshTokenTTLInSeconds,
		);
		const encryptedRefreshToken = this.aes256Cbc.encryptData(refreshToken);
		await this.usersCacheRepository.saveRefreshToken(
			userObjId.userId,
			encryptedRefreshToken,
			refreshTokenTTLInSeconds,
		);

		return { accessToken, refreshToken };
	}
}
