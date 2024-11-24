import { HttpResponseStatuses } from "../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import { ApiError } from "../../errors/api/apiError";
import type { logger } from "../../logger/logger";
import type { PasswordHasher } from "../../parsers/password/hasing/passwordHasher";
import type { UsersRepository } from "../../repository/usersRepository";

export class EditUserPasswordCase {
	constructor(
		private usersRepository: UsersRepository,
		private logger: logger,
		private passwordHasher: PasswordHasher,
	) {}

	async editPassword(
		userId: string,
		currentPassword: string,
		newPassword: string,
	) {
		const isPassChanged = await this.usersRepository.editUserPassword(
			userId,
			newPassword,
			currentPassword,
			this.passwordHasher,
		);
		if (!isPassChanged) {
			this.logger.debug(
				"Password not changed, userId or password are not correct",
			);
			throw new ApiError(
				"Failed to change user password",
				HttpResponseStatuses.badRequest,
				true,
			);
		}

		this.logger.debug("Sucessfully changed user password");
		return userId;
	}
}
