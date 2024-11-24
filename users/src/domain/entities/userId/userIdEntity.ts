import { UserIdError } from "./errors/userId/userIdErrors";

export class UserIdEntity {
	constructor(public userId: string) {
		this.#validateUserId(userId);
	}

	#validateUserId(this: UserIdEntity, userId: string): boolean {
		if (typeof userId !== "string") {
			throw new UserIdError(
				`Invalid userId. It must be a string, but received type: ${typeof userId}`,
			);
		}
		if (!userId) {
			throw new UserIdError(
				`Invalid userId. It must not be empty, but received: ${userId}`,
			);
		}
		return true;
	}
}
