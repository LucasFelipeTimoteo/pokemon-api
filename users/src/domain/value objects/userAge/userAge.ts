import { UserAgeError } from "./errors/userAge/userAgeError";

export class UserAge {
	constructor(public age: number) {
		this.#validateAge(age);
	}

	#validateAge(this: UserAge, age: number) {
		if (typeof age !== "number") {
			throw new UserAgeError(
				`Invalid age. It must be a number, but received type: ${typeof age}`,
			);
		}

		if (age < 6) {
			throw new UserAgeError(
				`Invalid age. It must be a number greater than 6, but received: ${age}`,
			);
		}

		if (age > 200) {
			throw new UserAgeError(
				`Invalid age. It must be a number less than 200, but received: ${age}`,
			);
		}
	}
}
