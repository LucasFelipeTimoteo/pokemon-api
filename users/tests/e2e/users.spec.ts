import type { Express } from 'express';
import request from 'supertest';
import userFixture from '../../src/global/fixtures/user/user.json';
import pokemonFixture from '../../src/global/fixtures/pokemon/pokemon.json';
import { Appfactory } from '../../src/infra/http/express/app/utils/factories/appFactory';
import { pinoLogger } from '../../src/infra/pino/pinoLogger';
import { MongooseSeeds } from './utils/seeds/mongoose/mongooseSeeds';
import { RedisSeeds } from './utils/seeds/redis/redisSeeds';

let app: Express
const mongooseSeeds = new MongooseSeeds(userFixture)
const redisSeeds = new RedisSeeds(pinoLogger, userFixture._id, userFixture.pokemons)

beforeEach(async () => {
	await redisSeeds.exec()
	const usersModel = await mongooseSeeds.configCollectionAndGetModel();
	app = Appfactory(redisSeeds.redisClientPromise, { usersModel }).exec();
})

afterAll(async () => {
	await mongooseSeeds.finishDatabase()
	await redisSeeds.finishDatabase()
})

describe('Users', () => {

	describe("createUser", () => {
		//HAPPY PATH
		it('Should successfully create an user given a [username: "John"] and [age: 30]. Also should return status 201', async () => {
			const userData = { username: "John", age: 30, password: '1233' }

			await request(app)
				.post("/users")
				.send(userData)
				.expect(201)
				.expect((res) => {
					expect(Object.entries(res.body).length).toBe(2)
					expect(typeof res.body.refreshToken).toBe("string")
					expect(typeof res.body.accessToken).toBe("string")
				})
		})

		// UNHAPPY PATH
		it('Should return an error message with prop [message] if username is not provided. The error message should be [Invalid username. It must be a string, but received type: undefined]. Also status should be 400', async () => {
			await request(app)
				.post("/users")
				.send({ age: 30 })
				.expect(400)
				.expect({ message: "Invalid username. It must be a string, but received type: undefined" })
		});

		it('Should return an error message with prop [message] if age is not provided. The error message should be [Invalid age. It must be a number, but received type: undefined] Also status should be 400', async () => {
			await request(app)
				.post("/users")
				.send({ username: 'John' })
				.expect(400)
				.expect({ message: 'Invalid age. It must be a number, but received type: undefined' })
		});

		it('Should return an error message with prop [message] if username length is less than 2, like 0. The error message should be [Invalid username. It must have at least 2 of legth, but received length: 0] Also status should be 400', async () => {
			await request(app)
				.post("/users")
				.send({ username: '', age: 21 })
				.expect(400)
				.expect({ message: 'Invalid username. It must have at least 2 of legth, but received length: 0' })
		});

		it('Should return an error message with prop [message] if username is greater than 30, like 31. The error message should be [Invalid username. It must have maximum 30 of legth, but received length: 31] Also status should be 400', async () => {
			await request(app)
				.post("/users")
				.send({ username: 'a'.repeat(31), age: 21 })
				.expect(400)
				.expect({ message: 'Invalid username. It must have maximum 30 of legth, but received length: 31' })
		});

		it('Should return an error message with prop [message] if username contain invalid characters, like space on [Jhon Doe]. The error message should be [Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John Doe] Also status should be 400', async () => {
			await request(app)
				.post("/users")
				.send({ username: 'John Doe', age: 21 })
				.expect(400)
				.expect({ message: 'Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John Doe' })
		});

		it('Should return an error message with prop [message] if username already exists. The error message should be [ApiError: Invalid username. Username already exists] Also status should be 400', async () => {
			await request(app)
				.post("/users")
				.send({ username: mongooseSeeds.defaultUser.username, age: 26, password: "abcdefg" })
				.expect(400)
				.expect({ message: 'ApiError: Invalid username. Username already exists' })
		});
	})

	describe("editUser", () => {
		// HAPPY PATH
		it("Should return the user without editions if [null] is provided as a edition value, like [username: null]. Also status should be 200", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { username: null } }
			const expectedUser = {
				userId: '673b9f14c6551139dba2f433',
				username: 'Goku',
				age: 30,
				pokemons: [pokemonFixture],

			}
			await request(app)
				.patch("/users")
				.send(userEdition)
				.expect(200)
				.expect(expectedUser)
		});

		it("Should return the user without editions if [null] is provided as a edition value, like [age: null]. Also status should be 200", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { age: null } }
			const expectedUser = {
				userId: '673b9f14c6551139dba2f433',
				username: 'Goku',
				age: 30,
				pokemons: [pokemonFixture],

			}
			await request(app)
				.patch("/users")
				.send(userEdition)
				.expect(200)
				.expect(expectedUser)
		});

		it("Should return the user without editions if [null] is provided as a edition value, like [pokemons: null]. Also status should be 200", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: null } }
			const expectedUser = {
				userId: '673b9f14c6551139dba2f433',
				username: 'Goku',
				age: 30,
				pokemons: [pokemonFixture],

			}
			await request(app)
				.patch("/users")
				.send(userEdition)
				.expect(200)
				.expect(expectedUser)
		});

		it("Should successfully edit the default user. For edition of [userEdition] that editss [username: 'Caio'] should return the edited user of [expectedEditeduser]. Also should return status 200", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { username: "Caio" } }

			const expectedEditeduser = {
				username: 'Caio',
				age: 30,
				pokemons: [pokemonFixture],
				userId: mongooseSeeds.defaultUser._id,

			}

			await request(app)
				.patch("/users")
				.send(userEdition)
				.expect(200)
				.expect(expectedEditeduser)
		});

		it("Should successfully edit the default user. For edition of [userEdition] that edits [age: 71] should return the edited user of [expectedEditeduser]. Also should return status 200", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { age: 71 } }

			const expectedEditeduser = {
				username: 'Goku',
				age: 71,
				pokemons: [pokemonFixture],
				userId: '673b9f14c6551139dba2f433',
			}

			await request(app)
				.patch("/users")
				.send(userEdition)
				.expect(200)
				.expect(expectedEditeduser)
		});

		it("Should successfully edit the default user. For edition of [userEdition] that edits [pokemons] to add a validPokemon on list should return the edited user of [expectedEditeduser]. Also should return status 200", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [pokemonFixture, pokemonFixture] } }

			const expectedEditeduser = {
				username: 'Goku',
				age: 30,
				pokemons: [pokemonFixture, pokemonFixture],
				userId: '673b9f14c6551139dba2f433',
			}

			await request(app)
				.patch("/users")
				.send(userEdition)
				.expect(200)
				.expect(expectedEditeduser)
		});

		// UNHAPPY PATH
		it("Should return an error object with a prop [message] that contains the message [ApiError: invalid userId. Cannot find an user with userId: 66d62088031a2073b50d6d61] if [userId] does not exist. Also should return a status 404", async () => {
			const unexisteduserEdition = { userId: "66d62088031a2073b50d6d61", userEdition: { username: "caio" } }
			await request(app)
				.patch("/users")
				.send(unexisteduserEdition)
				.expect(404)
				.expect({ message: "ApiError: invalid userId. Cannot find an user with userId: 66d62088031a2073b50d6d61" })
		});
		it("Should return an error object with a prop [message] that contains the message [Invalid username. It must be a string, but received type: number] if [username] is not a string, like a number. Also should return a status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { username: 123 } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid username. It must be a string, but received type: number" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid username. It must have at least 2 of legth, but received length: 1] if [username] length is less than 2, like 1. Also should return a status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { username: 'a' } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid username. It must have at least 2 of legth, but received length: 1" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid username. It must have maximum 30 of legth, but received length: 31] if [username] length is greater than 30, like 31. Also should return a status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { username: 'a'.repeat(31) } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid username. It must have maximum 30 of legth, but received length: 31" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John Doe] if [username] contains at least one non-[a-z, A-Z, 1-9] character, like 'space' of [John Doe]. Also should return a status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { username: 'John Doe' } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid username. It must only contain [1-9], [a-z] and [A-Z] characters, but received John Doe" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid age. It must be a number, but received type: string] if [age] type is not number, like string. Also should return a status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { age: '30' } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid age. It must be a number, but received type: string" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid age. It must be a number greater than 6, but received: 5] if [age] length is less than 6, like 5. Also should return a status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { age: 5 } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid age. It must be a number greater than 6, but received: 5" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid age. It must be a number less than 200, but received: 201] if [age] is greater than 200, like 201. Also should return a status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { age: 201 } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid age. It must be a number less than 200, but received: 201" })
		});

		it("Should return an error object with a prop [message] that contains the message ['Invalid pokemon_id. It must be a number, but received type: undefined' ] if [pokemons] is not an array of [Pokemon], like [hello]. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: ["hello"] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid pokemon_id. It must be a number, but received type: undefined" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid pokemon_id. It must be a number, but received type: string] if [pokemons] have a pokemon with [pokemon_id] type that is not number, like string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, pokemon_id: '1' }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid pokemon_id. It must be a number, but received type: string" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid pokemon_id. It must be a number greather than 0, but received: -1] if [pokemons] have a pokemon with [pokemon_id] less than 1, like [-1]. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, pokemon_id: -1 }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid pokemon_id. It must be a number greather than 0, but received: -1" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid name. It must be a string, but received type: number] if [pokemons] have a pokemon with [name] type that is not string, like number. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, name: 0 }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid name. It must be a string, but received type: number" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid height. It must be a number, but received type: string] if [pokemons] have a pokemon with [height] type that is not number, like string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, height: '0' }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid height. It must be a number, but received type: string" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid height. It must be a positive number, but received: 0] if [pokemons] have a pokemon with [height] less than 0, like -1. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, height: 0 }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid height. It must be a positive number, but received: 0" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid weight. It must be a number, but received type: string] if [pokemons] have a pokemon with [weight] type that is not number, like string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, weight: '0' }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid weight. It must be a number, but received type: string" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid weight. It must be a positive number, but received: -1] if [pokemons] have a pokemon with [weight] less than 0, like -1. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, weight: -1 }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid weight. It must be a positive number, but received: -1" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid abilities. It must be a non-empty array] if [pokemons] have a pokemon with [abilities] that is not an empty array. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, abilities: [] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid abilities. It must be a non-empty array" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid ability name. It must be a string, but received type: number] if [pokemons] have a pokemon with [abilities] that have a [name] that is not a string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, abilities: [{ name: 123 }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid ability name. It must be a string, but received type: number" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid ability name. It name must not be empty, but received: ] if [pokemons] have a pokemon with [abilities] that have a [name] that is an empty string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, abilities: [{ name: '' }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid ability name. It name must not be empty, but received: " })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid moves. It must be a non-empty array.] if [pokemons] have a pokemon with [moves] that is not an empty array. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, moves: [] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid moves. It must be a non-empty array." })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid move name. It must be a string, but received type: number] if [pokemons] have a pokemon with [moves] that have a [name] that is not a string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, moves: [{ name: 123 }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid move name. It must be a string, but received type: number" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid move name. It must not be empty, but received: ] if [pokemons] have a pokemon with [moves] that have a [name] that is an empty string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, moves: [{ name: '' }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid move name. It must not be empty, but received: " })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid types. It must be a non-empty array.] if [pokemons] have a pokemon with [types] that is not an empty array. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, types: [] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid types. It must be a non-empty array." })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid type name. It must be a string, but received type: number] if [pokemons] have a pokemon with [types] that have a [name] that is not a string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, types: [{ name: 123 }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid type name. It must be a string, but received type: number" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid type name. It must not be empty, but received: ] if [pokemons] have a pokemon with [types] that have a [name] that is an empty string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, types: [{ name: '' }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid type name. It must not be empty, but received: " })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid stats. It must be a non-empty array.] if [pokemons] have a pokemon with [stats] that is not an empty array. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, stats: [] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid stats. It must be a non-empty array." })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid stat name. It must be a string, but received type: number] if [pokemons] have a pokemon with [stats] that have a [name] that is not a string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, stats: [{ name: 123 }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid stat name. It must be a string, but received type: number" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid stat name. It must not be empty, but received ] if [pokemons] have a pokemon with [stats] that have a [name] that is an empty string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, stats: [{ name: '' }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid stat name. It must not be empty, but received " })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid stat base_stat. It must be a number, but received type: string] if [pokemons] have a pokemon with [stats] that have a [base_stat] that is not a number, like string. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, stats: [{ name: 'sddads', base_stat: '27' }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid stat base_stat. It must be a number, but received type: string" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid stat base_stat. It must not be a negative number, but received -1] if [pokemons] have a pokemon with [stats] that have a [base_stat] less than 0, like -1. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, stats: [{ name: 'sddads', base_stat: -1 }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid stat base_stat. It must not be a negative number, but received -1" })
		});

		it("Should return an error object with a prop [message] that contains the message [Invalid stat effort. It must not be a negative number, but received -1] if [pokemons] have a pokemon with [stats] that have a [effort] less than 0, like -1. Also Should return status 400", async () => {
			const invalidUserEdition = { userId: mongooseSeeds.defaultUser._id, userEdition: { pokemons: [{ ...pokemonFixture, stats: [{ name: 'sddads', base_stat: 5, effort: -1 }] }] } }
			await request(app)
				.patch("/users")
				.send(invalidUserEdition)
				.expect(400)
				.expect({ message: "Invalid stat effort. It must not be a negative number, but received -1" })
		})
	})

	describe("appendPokemons", () => {
		// HAPPY PATH
		it("Should append a new pokemon on user pokemons. Also status should be 200", async () => {
			const expectedUser = {
				userId: '673b9f14c6551139dba2f433',
				username: 'Goku',
				age: 30,
				pokemons: [pokemonFixture, pokemonFixture],
			}

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [pokemonFixture] }

			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(200)
				.expect(expectedUser)
		})

		// UNHAPPY PATH
		it("Should return an error object with prop [message] with value [ApiError: invalid userId. Cannot find an user with userId: 66f9c020845f2fbe86dcd4b0] if userId does not exists. Also status should be 404", async () => {
			const expectedErrorMessage = 'ApiError: invalid userId. Cannot find an user with userId: 66f9c020845f2fbe86dcd4b0'

			const userEdition = { userId: "66f9c020845f2fbe86dcd4b0", pokemons: [pokemonFixture] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(404)
				.expect({ message: expectedErrorMessage })
		})

		it("Should return an error object with prop [message] with value [Invalid pokemon_id. It must be a number, but received type: undefined] if not provide a pokemon object, like an empty object. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid pokemon_id. It must be a number, but received type: undefined'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{}] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		})

		it("Should return an error object with prop [message] with value [Invalid pokemon_id. It must be a number, but received type: string] if [pokemon_id] type is invalid, like '1'. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid pokemon_id. It must be a number, but received type: string'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, pokemon_id: '1' }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		})

		it("Should return an error object with prop [message] with value [Invalid pokemon_id. It must be a number greather than 0, but received: 0] if [pokemon_id] length is less than 1, like '0'. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid pokemon_id. It must be a number greather than 0, but received: 0'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, pokemon_id: 0 }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		})

		it("Should return an error object with prop [message] with value [Invalid name. It must be a string, but received type: number] if pokemon [name] type is not string, like number. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid name. It must be a string, but received type: number'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, name: 123 }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		})

		it("Should return an error object with prop [message] with value [Invalid name. It must not be empty, but received: ] if pokemon [name] is an empty string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid name. It must not be empty, but received: '

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, name: '' }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid height. It must be a number, but received type: string] if pokemon [height] type is not number, like string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid height. It must be a number, but received type: string'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, height: '' }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid height. It must be a positive number, but received: 0] if pokemon [height] is less than 1, like 0. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid height. It must be a positive number, but received: 0'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, height: 0 }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid height. It must be a number, but received type: string] if pokemon [weigth] is not a number, like '1'. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid height. It must be a number, but received type: string'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, height: '1' }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid height. It must be a positive number, but received: -1] if pokemon [weigth] is less than 0, like -1. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid height. It must be a positive number, but received: -1'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, height: -1 }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid abilities. It must be a non-empty array] if pokemon [abilities] is an empty array. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid abilities. It must be a non-empty array'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, abilities: [] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid ability name. It must be a string, but received type: number] if pokemon abilities [name] is not a string, like number. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid ability name. It must be a string, but received type: number'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, abilities: [{ name: 123 }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid ability name. It must be a string, but received type: number] if pokemon abilities [name] is not a string, like number. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid ability name. It must be a string, but received type: number'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, abilities: [{ name: 123 }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid ability name. It name must not be empty, but received: ] if pokemon abilities [name] is a empty string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid ability name. It name must not be empty, but received: '

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, abilities: [{ name: '' }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid moves. It must be a non-empty array.] if pokemon [moves] is a empty array. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid moves. It must be a non-empty array.'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, moves: [] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid move name. It must be a string, but received type: number] if pokemon moves [name] type is not a string, like number. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid move name. It must be a string, but received type: number'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, moves: [{ name: 123 }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid move name. It must not be empty, but received: ] if pokemon moves [name] is an empty string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid move name. It must not be empty, but received: '

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, moves: [{ name: '' }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid type name. It must be a string, but received type: number] if pokemon types [name] type is not string, like number. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid type name. It must be a string, but received type: number'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, types: [{ name: 123 }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid type name. It must not be empty, but received: ] if pokemon types [name] is an empty string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid type name. It must not be empty, but received: '

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, types: [{ name: '' }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid stats. It must be a non-empty array.] if pokemon stats is an empty string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid stats. It must be a non-empty array.'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, stats: [] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid stat name. It must be a string, but received type: number] if pokemon stats [name] type is not a string, like a number. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid stat name. It must be a string, but received type: number'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, stats: [{ name: 123 }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid stat name. It must not be empty, but received ] if pokemon stats [name] is an empty string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid stat name. It must not be empty, but received '

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, stats: [{ name: '' }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid stat base_stat. It must be a number, but received type: string] if pokemon stats [base_stat] type is not a number, like a string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid stat base_stat. It must be a number, but received type: string'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, stats: [{ name: 'dasda', base_stat: "12" }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid stat base_stat. It must not be a negative number, but received -1] if pokemon stats [base_stat] is less than 0, like -1. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid stat base_stat. It must not be a negative number, but received -1'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, stats: [{ name: 'dasda', base_stat: -1 }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid stat effort. It must not be a negative number, but received -1] if pokemon stats [effort] is less than 0, like -1. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid stat effort. It must not be a negative number, but received -1'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, stats: [{ name: 'dasda', base_stat: 1, effort: -1 }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid stat effort. It must be a number, but received type: string] if pokemon stats [effort] type is not number, like string. Also status should be 400", async () => {
			const expectedErrorMessage = 'Invalid stat effort. It must be a number, but received type: string'

			const userEdition = { userId: mongooseSeeds.defaultUser._id, pokemons: [{ ...pokemonFixture, stats: [{ name: 'dasda', base_stat: 1, effort: "1" }] }] }
			await request(app)
				.post("/users/pokemons")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

	})

	describe("showUserPokemons", () => {
		// 	// HAPPY PATH
		it("Should Successfully show pokemons of a user from cache given an existing [userId] as param. Also, status should be 200", async () => {
			const userId = mongooseSeeds.defaultUser._id

			await request(app)
				.get(`/users/pokemons/${userId}`)
				.expect(200)
				.expect(userFixture.pokemons)
		})

		it("Should Successfully show pokemons of a user from database given an existing [userId] as param and no cache available. Also, status should be 200", async () => {
			const userId = mongooseSeeds.defaultUser._id
			await redisSeeds.clearDatabase()

			await request(app)
				.get(`/users/pokemons/${userId}`)
				.expect(200)
				.expect(userFixture.pokemons)
		})

		// UNHAPPY PATH
		it("Should return an error object with prop [message] with value [ApiError: Cannot find an user with provided userId: 66d631125ce925f54be34549] if userId is valid, but dont match any user. Also, status should be 404", async () => {
			const unexistedUserId = '66d631125ce925f54be34549'
			const errorMessage = "ApiError: Cannot find an user with provided userId: 66d631125ce925f54be34549"

			await request(app)
				.get(`/users/pokemons/${unexistedUserId}`)
				.expect(404)
				.expect({ message: errorMessage })
		});

		it("Should return an error object with prop [message] with value [Unexpected unknown error. Cannot process request] if userId is invalid. Also, status should be 500", async () => {
			const invaliduserId = 'some-invalid-user-id'
			const errorMessage = `Unexpected unknown error. Cannot process request`

			await request(app)
				.get(`/users/pokemons/${invaliduserId}`)
				.expect(500)
				.expect({ message: errorMessage })
		});
	})

	describe("removeUserPokemon", () => {

		// HAPPY PATH
		it("Should successfully remove a pokemon of pokemons list in a user given a valid [userId] and [pokemonId]. The response should have a prop [removedPokemonId] with the id of removed pokemon. Also status should be 200", async () => {
			const validUserId = mongooseSeeds.defaultUser._id
			const validPokemonId = mongooseSeeds.defaultUser.pokemons[0].pokemon_id

			await request(app)
				.delete(`/users/pokemons/${validUserId}/${validPokemonId}`)
				.expect(200)
				.expect({ removedPokemonId: validPokemonId })
		});

		it("Should successfully update cache of user pokemons after removing a pokemon from list.", async () => {
			const validUserId = mongooseSeeds.defaultUser._id
			const validPokemonId = mongooseSeeds.defaultUser.pokemons[0].pokemon_id

			await request(app)
				.get(`/users/pokemons/${validUserId}`)
				.expect(200)
				.expect([pokemonFixture])

			await request(app)
				.delete(`/users/pokemons/${validUserId}/${validPokemonId}`)
				.expect(200)
				.expect({ removedPokemonId: validPokemonId })

			await request(app)
				.get(`/users/pokemons/${validUserId}`)
				.expect(200)
				.expect([])
		});

		// UNHAPPY PATH
		it("Should return an error object with prop [message] with value [Unexpected unknown error. Cannot process request] if [userId] is invalid Mongo ObjectId. Also status should be 500", async () => {
			const invalidUserId = 'ivalid'
			const validPokemonId = mongooseSeeds.defaultUser.pokemons[0].pokemon_id
			const expectedErrormessage = "Unexpected unknown error. Cannot process request"


			await request(app)
				.delete(`/users/pokemons/${invalidUserId}/${validPokemonId}`)
				.expect(500)
				.expect({ message: expectedErrormessage })
		});

		it("Should return an error object with prop [message] with value [ApiError: Cannot find an user with provided userId: 66d62088031a2073b50d6d67] if [userId] is non-existent, like 66d62088031a2073b50d6d67. Also status should be 404", async () => {
			const nonExistentUserId = '66d62088031a2073b50d6d67'
			const validPokemonId = mongooseSeeds.defaultUser.pokemons[0].pokemon_id
			const expectedErrormessage = "ApiError: Cannot find an user with provided userId: 66d62088031a2073b50d6d67"


			await request(app)
				.delete(`/users/pokemons/${nonExistentUserId}/${validPokemonId}`)
				.expect(404)
				.expect({ message: expectedErrormessage })
		});

		it("Should return an error object with prop [message] with value [Invalid pokemon_id. It must be a number greather than 0, but received: 0] if [pokemonId] is less than 1, like 0. Also status should be 400", async () => {
			const validUserId = mongooseSeeds.defaultUser._id
			const invalidPokemonId = 0
			const expectedErrormessage = "Invalid pokemon_id. It must be a number greather than 0, but received: 0"

			await request(app)
				.delete(`/users/pokemons/${validUserId}/${invalidPokemonId}`)
				.expect(400)
				.expect({ message: expectedErrormessage })
		});

		it("Should return an error object with prop [message] with value [ApiError: Cannot find a pokemon with provided pokemonId: NaN in the user 673b9f14c6551139dba2f433] if [pokemonId] type is not a number, like string. Also status should be 404", async () => {
			const validUserId = mongooseSeeds.defaultUser._id
			const invalidPokemonId = "1a"
			const expectedErrormessage = "ApiError: Cannot find a pokemon with provided pokemonId: NaN in the user 673b9f14c6551139dba2f433"

			await request(app)
				.delete(`/users/pokemons/${validUserId}/${invalidPokemonId}`)
				.expect(404)
				.expect({ message: expectedErrormessage })
		});
	})

	describe("EditUserPassword", () => {
		//HAPPY PATH
		it("Should return an object with prop [message] with value [Sucessfully changed password for user: 673b9f14c6551139dba2f433] if [currentPassword] [newPasswors] and [userId] are correct. Also status should be 200", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, currentPassword: mongooseSeeds.nonHashedUserPassword, newPassword: "123" }
			const expectedSuccessMessage = 'Sucessfully changed password for user: 673b9f14c6551139dba2f433'
			await request(app)
				.patch("/users/password")
				.send(userEdition)
				.expect(200)
				.expect({ message: expectedSuccessMessage })
		});

		// UNHAPPY PATH
		it("Should return an error object with prop [message] with value [ApiError: Failed to change user password] if [currentPassword] is not correct. Also status should be 400", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, currentPassword: mongooseSeeds.nonHashedUserPassword + "invalid!", newPassword: "123" }
			const expectedErrorMessage = 'ApiError: Failed to change user password'
			await request(app)
				.patch("/users/password")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [Invalid user password. It must not be empty, but received: ] if [newPassword] is not valid. Also status should be 400", async () => {
			const userEdition = { userId: mongooseSeeds.defaultUser._id, currentPassword: mongooseSeeds.nonHashedUserPassword, newPassword: "" }
			const expectedErrorMessage = 'Invalid user password. It must not be empty, but received: '
			await request(app)
				.patch("/users/password")
				.send(userEdition)
				.expect(400)
				.expect({ message: expectedErrorMessage })
		});

		it("Should return an error object with prop [message] with value [] if [userId] do not match any user. Also status should be 404", async () => {
			const nonExistentuserId = "66f9c020845f2fbe86dcd4b7"
			const userEdition = { userId: nonExistentuserId, currentPassword: mongooseSeeds.nonHashedUserPassword, newPassword: "123456" }
			const expectedErrorMessage = 'ApiError: invalid userId. Cannot find an user with userId: 66f9c020845f2fbe86dcd4b7'
			await request(app)
				.patch("/users/password")
				.send(userEdition)
				.expect(404)
				.expect({ message: expectedErrorMessage })
		});

	})

	describe("AccessTokenRefresh", () => {
		// HAPPY PATH
		it("Shoukd sucessfully return an object with prop [newAccessToken] that contains a string with jwt access token. Also, status should be 200", async () => {
			await request(app)
				.post("/users/token/refresh")
				.send({
					expiredToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzNiOWYxNGM2NTUxMTM5ZGJhMmY0MzMiLCJpYXQiOjE3MzIyMDQ3MzQsImV4cCI6MTczMjIwODMzNH0.v1etzAfpzTGHlcgKIOroMfUyH67o47AK_ZXT2s4xreg",
					refreshToken: redisSeeds.redisRefreshToken
				})
				.expect(200)
				.expect((res) => {
					expect(Object.entries(res.body).length).toBe(1)
					expect(typeof res.body.newAccessToken).toBe("string")
				})
		});

		// UNHAPPY PATH
		it("Shoukd return an error object with prop [message] with value [Invalid Token. Cannot be decoded] if [expiredToken] was not provided. Also, status should be 400", async () => {
			await request(app)
				.post("/users/token/refresh")
				.expect(400)
				.expect({ message: 'Invalid Token. Cannot be decoded' })
		});

		it("Shoukd return an error object with prop [message] with value [Invalid Token. Cannot be decoded] if [expiredToken] contains a invalid jwt. Also, status should be 400", async () => {
			await request(app)
				.post("/users/token/refresh")
				.send({ expiredToken: "invalidToken" })
				.expect(400)
				.expect({ message: 'Invalid Token. Cannot be decoded' })
		});

		it("Shoukd return an error object with prop [message] with value [ApiError: Cannot generate new accessToken because a refreshToken for user [hdedwbjniasdnqwjdiwewdwe] does not exists] if do a refreshToken with the id of Access token do not exists. Also, status should be 404", async () => {
			const unmatchToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcklkIjoiaGRlZHdiam5pYXNkbnF3amRpd2V3ZHdlIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.ymzrMapXmGAlv7zMyiU4miD4LKOI7fTJo1oFGXflitE"
			await request(app)
				.post("/users/token/refresh")
				.send({ expiredToken: unmatchToken })
				.expect(404)
				.expect({ message: 'ApiError: Cannot generate new accessToken because a refreshToken for user [hdedwbjniasdnqwjdiwewdwe] does not exists' })
		});

	})

	describe("login", () => {

		// HAPPY PATH
		it("Should successfully login and return an object with prop [newAccessToken] with a token that is a string. Also status should be 200", async () => {
			await request(app)
				.post("/users/login")
				.send({ username: mongooseSeeds.defaultUser.username, password: mongooseSeeds.nonHashedUserPassword })
				.expect(200)
				.expect((res) => {
					expect(Object.entries(res.body).length).toBe(2)
					expect(typeof res.body.refreshToken).toBe("string")
					expect(typeof res.body.accessToken).toBe("string")
				})
		});

		// UNHAPPY PATH
		it("Should return an arror object with prop [message] with value [Invalid username. It must have at least 2 of legth, but received length: 0] if username is invalid because it does not have at least 2 of length, like an empty string. Also status should be 400", async () => {
			await request(app)
				.post("/users/login")
				.send({ username: "", password: mongooseSeeds.nonHashedUserPassword })
				.expect(400)
				.expect({ message: "Invalid username. It must have at least 2 of legth, but received length: 0" })
		});

		it("Should return an arror object with prop [message] with value [Invalid username. It must have at least 2 of legth, but received length: 1] if username is invalid because it does not have at least 2 of length, like [A]. Also status should be 400", async () => {
			await request(app)
				.post("/users/login")
				.send({ username: "A", password: mongooseSeeds.nonHashedUserPassword })
				.expect(400)
				.expect({ message: "Invalid username. It must have at least 2 of legth, but received length: 1" })
		});

		it("Should return an arror object with prop [message] with value [Invalid username. It must have at least 2 of legth, but received length: 1] if username is invalid because it does not have at least 2 of length, like [A]. Also status should be 400", async () => {
			await request(app)
				.post("/users/login")
				.send({ username: "A", password: mongooseSeeds.nonHashedUserPassword })
				.expect(400)
				.expect({ message: "Invalid username. It must have at least 2 of legth, but received length: 1" })
		});

		it("Should return an arror object with prop [message] with value [ApiError: Invalid username or password] if username is do not exists. Also status should be 400", async () => {
			await request(app)
				.post("/users/login")
				.send({ username: "NONEXISTEDNTUSER", password: mongooseSeeds.nonHashedUserPassword })
				.expect(400)
				.expect({ message: "ApiError: Invalid username or password" })
		});

		it("Should return an arror object with prop [message] with value [ApiError: Invalid username or password] if password is not correct for an valid user. Also status should be 400", async () => {
			await request(app)
				.post("/users/login")
				.send({ username: mongooseSeeds.defaultUser.username, password: "INVALIDPASS" })
				.expect(400)
				.expect({ message: "ApiError: Invalid username or password" })
		});

		it("Should return an arror object with prop [message] with value [Invalid user password. It must not be empty, but received: ] for a invalid password because it length is 0. Also status should be 400", async () => {
			await request(app)
				.post("/users/login")
				.send({ username: mongooseSeeds.defaultUser.username, password: "" })
				.expect(400)
				.expect({ message: "Invalid user password. It must not be empty, but received: " })
		});

	})
})