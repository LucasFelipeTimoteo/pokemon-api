import { UserAge } from "../../userAge";

describe("userAge", () => {
	// HAPPY PATH
	it("Should successfully return a age if [age] is valid, like 20", () => {
		const validAge = 20;
		const userAge = new UserAge(validAge);

		expect(userAge.age).toBe(validAge);
	});

	// UNHAPPY PATH
	it("Should throw an error with message [Invalid age. It must be a number, but received type: string] if [age] is a string instead of number", () => {
		const expectedErrorMessage =
			"Invalid age. It must be a number, but received type: string";
		const invalidAge = "20" as any as number;
		const userAge = () => new UserAge(invalidAge);

		expect(userAge).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid age. It must be a number greater than 6, but received: 5] if [age] is a number less than 6, like 5", () => {
		const expectedErrorMessage =
			"Invalid age. It must be a number greater than 6, but received: 5";
		const invalidAge = 5;
		const userAge = () => new UserAge(invalidAge);

		expect(userAge).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid age. It must be a number less than 200, but received: 201] if [age] is a number greater than 200, like 201", () => {
		const expectedErrorMessage =
			"Invalid age. It must be a number less than 200, but received: 201";
		const invalidAge = 201;
		const userAge = () => new UserAge(invalidAge);

		expect(userAge).toThrow(expectedErrorMessage);
	});
});
