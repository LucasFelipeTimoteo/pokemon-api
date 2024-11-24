import { UserNameError } from "./errors/userName/userNameError";

export class UserName {
	#regexNamevalidation = /^[a-zA-Z0-9]+$/;

	constructor(public username: string) {
		this.#validateUsername(username);
	}
	#validateUsername(this: UserName, username: string) {
		if (typeof username !== "string") {
			throw new UserNameError(
				`Invalid username. It must be a string, but received type: ${typeof username}`,
			);
		}

		if (username.length < 2) {
			throw new UserNameError(
				`Invalid username. It must have at least 2 of legth, but received length: ${username.length}`,
			);
		}

		if (username.length > 30) {
			throw new UserNameError(
				`Invalid username. It must have maximum 30 of legth, but received length: ${username.length}`,
			);
		}

		if (!this.#regexNamevalidation.test(username)) {
			throw new UserNameError(
				`Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received ${username}`,
			);
		}
	}
}
