import type { User } from "../../../domain/entities/user/types/user";
import { appEnv } from "../../../global/utils/env/appEnv/appEnv";
import type { Aes256Cbc } from "../../crypto/simetric/aes/aes256Cbc/aes256cbc";
import { ApiError } from "../../errors/api/apiError";
import { ServerError } from "../../errors/server/serverError";
import type { logger } from "../../logger/logger";
import type { PasswordHasher } from "../../parsers/password/hasing/passwordHasher";
import type { UsersCacheRepository } from "../../repository/usersCacheRepository";
import type { UsersRepository } from "../../repository/usersRepository";
import type { JWTTokens } from "../../tokens/jwt/JWTTokens";

export class CreateUserCase {
	constructor(
		private usersRepository: UsersRepository,
		private usersCacheRepository: UsersCacheRepository,
		private logger: logger,
		private passwordHasher: PasswordHasher,
		private JWTTokens: JWTTokens,
		private aes256Cbc: Aes256Cbc,
	) {}

	async create(
		user: User,
	): Promise<{ accessToken: string; refreshToken: string }> {
		try {
			const salt = await this.passwordHasher.genSalt(Number(appEnv.salt));
			const hashedPassword = await this.passwordHasher.hashAsync(
				user.password,
				salt,
			);
			const securyUser: User = { ...user, password: hashedPassword };
			const createdUser = await this.usersRepository.createUser(securyUser);
			this.logger.debug("New user created");

			const accessTokenTTLInSeconds = Number(appEnv.accessTokenTTLMinutes) * 60;
			const refreshTokenTTLInSeconds =
				Number(appEnv.refreshTokenTTLDays) * 24 * 60 * 60;

			const tokenPayload = { userId: createdUser.userId };
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
				createdUser.userId,
				encryptedRefreshToken,
				refreshTokenTTLInSeconds,
			);

			return { accessToken, refreshToken };
		} catch (error) {
			if (error instanceof ApiError) {
				throw error;
			}

			if (error instanceof Error) {
				throw new ServerError(error.message);
			}

			throw error;
		}
	}
}
