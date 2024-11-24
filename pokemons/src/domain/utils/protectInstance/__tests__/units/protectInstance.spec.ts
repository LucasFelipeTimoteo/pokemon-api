import { protectInstance } from "../../protectinstance";

describe("protectnstance", () => {
	// HAPPY PATH
	it("Should be a frozen instance", () => {
		const mockInstance = { firstName: "John", lastName: "Doe" };
		protectInstance(mockInstance);

		expect(Object.isFrozen(mockInstance)).toBe(true);
	});

	it("Should be a enumerable instance if [isEnumerable] is true", () => {
		const mockInstance = { firstName: "John", lastName: "Doe" };
		protectInstance(mockInstance, true);

		const expectedSubset = { enumerable: true };

		expect(
			Object.getOwnPropertyDescriptor(mockInstance, "firstName"),
		).toMatchObject(expectedSubset);
		expect(
			Object.getOwnPropertyDescriptor(mockInstance, "lastName"),
		).toMatchObject(expectedSubset);
	});

	it("Should not be a enumerable instance if [isEnumerable] is false", () => {
		const mockInstance = { firstName: "John", lastName: "Doe" };
		protectInstance(mockInstance, false);

		const expectedSubset = { enumerable: false };

		expect(
			Object.getOwnPropertyDescriptor(mockInstance, "firstName"),
		).toMatchObject(expectedSubset);
		expect(
			Object.getOwnPropertyDescriptor(mockInstance, "lastName"),
		).toMatchObject(expectedSubset);
	});

	it("Should not be a enumerable instance if [isEnumerable] is not defined", () => {
		const mockInstance = { firstName: "John", lastName: "Doe" };
		protectInstance(mockInstance, false);

		const expectedSubset = { enumerable: false };

		expect(
			Object.getOwnPropertyDescriptor(mockInstance, "firstName"),
		).toMatchObject(expectedSubset);
		expect(
			Object.getOwnPropertyDescriptor(mockInstance, "lastName"),
		).toMatchObject(expectedSubset);
	});

	// UNHAPPY PATH
	it("Should throw an error with message [Cannot assign to read only property 'firstName' of object '#<Object>'] when trying to rewrite a property value", () => {
		const expectedErrorMessage =
			"Cannot assign to read only property 'firstName' of object '#<Object>'";
		const mockInstance = { firstName: "John", lastName: "Doe" };
		protectInstance(mockInstance);

		expect(() => {
			mockInstance.firstName = "Ana";
		}).toThrow(expectedErrorMessage);
	});

	it("Should throw an error if trying to delete a property with error message [Cannot delete property 'firstName' of #<Object>]", () => {
		const expectederrorMessage =
			"Cannot delete property 'firstName' of #<Object>";
		const mockInstance = { firstName: "John", lastName: "Doe" } as any;
		protectInstance(mockInstance);

		expect(() => {
			/* biome-ignore lint/performance/noDelete: Disable this rule to test deleting a prop */
			delete mockInstance.firstName;
		}).toThrow(expectederrorMessage);
	});

	it("Should throw an error if trying to reconfigure property firstName. Error message should be [Cannot redefine property: firstName]", () => {
		const expectederrorMessage = "Cannot redefine property: firstName";
		const mockInstance = { firstName: "John", lastName: "Doe" } as any;
		const received = () => {
			Object.defineProperty(mockInstance, "firstName", { configurable: true });
		};
		protectInstance(mockInstance);

		expect(received).toThrow(expectederrorMessage);
	});
});
