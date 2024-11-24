import { UserIdEntity } from "../../userIdEntity";

describe("UserIdEntity", () => {
	// HAPPY PATH
	it("Should successfully return a userId if [userId] is correct", () => {
		const userId = "abcdefghijklmnopq";
		const userIdEntity = new UserIdEntity(userId);
		expect(userIdEntity.userId).toBe(userId);
	});

	// UNHAPPY PATH
	it("Should throw an error with message [Invalid userId. It must be a string, but received type: number] if [userId] is not a string", () => {
		const expectedErrorMessage =
			"Invalid userId. It must be a string, but received type: number";
		const invaliduserId = 1234 as any as string;
		const invalidUserIdEntity = () => new UserIdEntity(invaliduserId);

		expect(invalidUserIdEntity).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid userId. It must not be empty, but received: ] if [userId] is not a string", () => {
		const expectedErrorMessage =
			"Invalid userId. It must not be empty, but received: ";
		const invaliduserId = "";
		const invalidUserIdEntity = () => new UserIdEntity(invaliduserId);

		expect(invalidUserIdEntity).toThrow(expectedErrorMessage);
	});
});
