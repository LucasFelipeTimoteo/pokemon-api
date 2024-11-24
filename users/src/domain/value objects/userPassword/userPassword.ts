import { protectInstance } from "../../utils/protectInstance/protectinstance";
import { UserPasswordError } from "./errors/userPasswordError/userPasswordError";

export class UserPassword {
	constructor(public password: string) {
		this.#validateUserPassword(password);

		protectInstance(this, false);
	}

	#validateUserPassword(password: string) {
		if (typeof password !== "string") {
			throw new UserPasswordError(
				`Invalid user password. It must be a string, but received type: ${typeof password}`,
			);
		}
		if (!password) {
			throw new UserPasswordError(
				`Invalid user password. It must not be empty, but received: ${password}`,
			);
		}
		return true;
	}
}
