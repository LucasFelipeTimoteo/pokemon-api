import { UserName } from "../../userName";

describe("userAge", () => {
	// HAPPY PATH
	it("Should successfully return a age if [name] is valid, like [John]", () => {
		const validName = "John";
		const userAge = new UserName(validName);

		expect(userAge.username).toBe(validName);
	});

	// UNHAPPY PATH
	it("Should throw an error with message [Invalid username. It must be a string, but received type: number] if [name] is not a string, like a number", () => {
		const expectedErrorMessage =
			"Invalid username. It must be a string, but received type: number";
		const invalidName = 20223 as any as string;
		const userAge = () => new UserName(invalidName);

		expect(userAge).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid username. It must have at least 2 of legth, but received length: 1] if [name] has a length less than 2, like 1", () => {
		const expectedErrorMessage =
			"Invalid username. It must have at least 2 of legth, but received length: 1";
		const invalidName = "A";
		const userAge = () => new UserName(invalidName);

		expect(userAge).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid username. It must have maximum 30 of legth, but received length: 31] if [name] has a legth greater than 30 like 31", () => {
		const expectedErrorMessage =
			"Invalid username. It must have maximum 30 of legth, but received length: 31";
		const invalidName = "a".repeat(31);
		const userAge = () => new UserName(invalidName);

		expect(userAge).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John Doe] if [name] has characters out of the range [1-9], [a-z] and [A-Z], like [John Doe]", () => {
		const expectedErrorMessage =
			"Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John Doe";
		const invalidName = "John Doe";
		const userAge = () => new UserName(invalidName);

		expect(userAge).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received @John] if [name] has characters out of the range [1-9], [a-z] and [A-Z], like [@John]", () => {
		const expectedErrorMessage =
			"Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received @John";
		const invalidName = "@John";
		const userAge = () => new UserName(invalidName);

		expect(userAge).toThrow(expectedErrorMessage);
	});

	it("Should throw an error with message [Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John_Doe] if [name] has characters out of the range [1-9], [a-z] and [A-Z], like [John_Doe]", () => {
		const expectedErrorMessage =
			"Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John_Doe";
		const invalidName = "John_Doe";
		const userAge = () => new UserName(invalidName);

		expect(userAge).toThrow(expectedErrorMessage);
	});
});
