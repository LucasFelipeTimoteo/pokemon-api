import { UserPassword } from "../../../../../domain/value objects/userPassword/userPassword";

describe("PokemonName", () => {
	// HAPPY PATH
	it("Should successfully return [1345678] when password is valid, like 12345678", () => {
		const userPassword = new UserPassword("12345678").password;
		const expected = "12345678";

		expect(userPassword).toEqual(expected);
	});

	// UNHAPPY PATH
	it("Should throw an error with message [Invalid user password. It must be a string, but received type: number], if provided password type is not string, like number", () => {
		const expectedErrorMessage =
			"Invalid user password. It must be a string, but received type: number";

		const invalidPassword = 123 as unknown as string;
		const invalidUserPassword = () => {
			new UserPassword(invalidPassword);
		};

		expect(invalidUserPassword).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid user password. It must not be empty, but received: ] for empty password", () => {
		const expectedErrorMessage =
			"Invalid user password. It must not be empty, but received: ";
		const invalidPassword = () => {
			new UserPassword("");
		};

		expect(invalidPassword).toThrow(expectedErrorMessage);
	});
});
