import { UserEntity } from "../../userEntity";

let userEntity: UserEntity;

beforeEach(() => {
	userEntity = new UserEntity("John", 20, "1234", [], "abc");
});

describe("UserEntity", () => {
	it("Should return a valid user instance when all provided data is correct and userId is provided", () => {
		const validUserEntity = {
			userId: "abc",
			username: "John",
			age: 20,
			pokemons: [],
			password: "1234",
		};
		expect(userEntity).toEqual(validUserEntity);
	});

	it("Should return a valid user instance when all provided data is correct", () => {
		const { userId, ...userEntityWithouId } = userEntity;
		const validUserEntity = {
			username: "John",
			age: 20,
			pokemons: [],
			password: "1234",
		};

		expect(userEntityWithouId).toEqual(validUserEntity);
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
