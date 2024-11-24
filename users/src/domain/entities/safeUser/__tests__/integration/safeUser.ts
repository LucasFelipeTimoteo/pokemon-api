import { SafeUserEntity } from "../../../safeUser/safeUserEntity";

let userEntity: SafeUserEntity;

beforeEach(() => {
	userEntity = new SafeUserEntity("abc", "John", 20, []);
});

describe("UserEntity", () => {
	it("Should return a valid safe user instance when all provided data is correct and userId is provided", () => {
		const validSafeUserEntity = {
			userId: "abc",
			username: "John",
			age: 20,
			pokemons: [],
		};
		expect(userEntity).toEqual(validSafeUserEntity);
	});

	it("Should return a valid safe user instance when all provided data is correct", () => {
		const { userId, ...userEntityWithouId } = userEntity;
		const validSafeUserEntity = {
			username: "John",
			age: 20,
			pokemons: [],
		};

		expect(userEntityWithouId).toEqual(validSafeUserEntity);
	});

	it("Should return an instance that all properties are enumerable", () => {
		const expectedSubset = { enumerable: true };

		const userIdDescriptor = Object.getOwnPropertyDescriptor(
			userEntity,
			"userId",
		);
		const usernameDescriptor = Object.getOwnPropertyDescriptor(
			userEntity,
			"username",
		);
		const ageDescriptor = Object.getOwnPropertyDescriptor(userEntity, "age");

		expect(userIdDescriptor).toMatchObject(expectedSubset);
		expect(usernameDescriptor).toMatchObject(expectedSubset);
		expect(ageDescriptor).toMatchObject(expectedSubset);
	});

	it("Should return a frozen instance", () => {
		expect(Object.isFrozen(userEntity)).toBe(true);
	});
});
