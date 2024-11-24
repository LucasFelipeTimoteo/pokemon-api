import { HttpResponseStatuses } from "../../../adapters/presenters/http/response/utils/httpResponseStatuses/httpResponseStatuses";
import type { SafeUser } from "../../../domain/entities/safeUser/types/safeUser";
import { ApiError } from "../../errors/api/apiError";
import { ServerError } from "../../errors/server/serverError";
import type { UsersRepository } from "../../repository/usersRepository";

export class EditUserCase {
	constructor(private usersRepository: UsersRepository) {}

	async edit(userId: string, userEdition: Partial<SafeUser>) {
		try {
			const editedUser = await this.usersRepository.editUser(
				userId,
				userEdition,
			);

			if (!editedUser) {
				throw new ApiError(
					`invalid userId. Cannot find an user with userId: ${userId}`,
					HttpResponseStatuses.notFound,
					true,
				);
			}

			return editedUser;
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
