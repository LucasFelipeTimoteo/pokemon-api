import type { Express } from 'express'
import request from 'supertest'
import { WebBFFPokemonRouter } from '../../src/BFFs/web/router/pokemons/webBFFPokemonRouter'
import { WebBFFUsersRouter } from '../../src/BFFs/web/router/usersRouter/webBFFUsersRouter'
import pokemonFixture from '../../src/global/fixtures/pokemon/pokemon.json'
import { Server } from '../../src/server'

let app: Express
const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIzODM0MmMwZmM4NzE1YjAxY2Q0NzkiLCJpYXQiOjE3MzAzOTc0MTAsImV4cCI6MTczMDM5NzUxM30.vr4q1zMHqkqb3Ywi0Oc2PS35MULg1-97lnl_nXUtuP8"

beforeEach(async () => {
	const webBFFPokemonRouter = new WebBFFPokemonRouter()
	const webBFFUsersRouter = new WebBFFUsersRouter()
	app = await new Server(webBFFPokemonRouter, webBFFUsersRouter).exec()
})

describe("Api Gateway Auth", () => {

	describe("Edit user Data", () => {
		it("Should return the error object { message: 'Authorization header must be provided' } if the acessToken is not provided. Also, status should be 400", async () => {
			await request(app)
				.patch("/users")
				.expect(401)
				.expect({ message: 'Authorization header must be provided' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken is not a valid jwt. Also, status should be 500", async () => {
			await request(app)
				.patch("/users")
				.set("Authorization", "Bearer invalid-token")
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

		it("Should return the error object { message: 'Auth type must be a Bearer' } if the provded authentication tyoe is not a valid Bearer, like Basic. Also, status should be 500", async () => {
			await request(app)
				.patch("/users")
				.set("Authorization", `Basic ${expiredToken}`)
				.expect(401)
				.expect({ message: 'Auth type must be a Bearer' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken jwt is expired. Also, status should be 500", async () => {
			await request(app)
				.patch("/users")
				.set("Authorization", `Bearer ${expiredToken}`)
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});
	})

	describe("Edit user password", () => {
		it("Should return the error object { message: 'Authorization header must be provided' } if the acessToken is not provided. Also, status should be 400", async () => {
			await request(app)
				.patch("/users/password")
				.send({
					"userId": "67238342c0fc8715b01cd479",
					"currentPassword": "123456",
					"newPassword": "123456"
				})
				.expect(401)
				.expect({ message: 'Authorization header must be provided' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken is not a valid jwt. Also, status should be 500", async () => {
			await request(app)
				.patch("/users/password")
				.send({
					"userId": "67238342c0fc8715b01cd479",
					"currentPassword": "123456",
					"newPassword": "123456"
				})
				.set("Authorization", "Bearer invalid-token")
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

		it("Should return the error object { message: 'Auth type must be a Bearer' } if the provded authentication tyoe is not a valid Bearer, like Basic. Also, status should be 500", async () => {
			await request(app)
				.patch("/users/password")
				.send({
					"userId": "67238342c0fc8715b01cd479",
					"currentPassword": "123456",
					"newPassword": "123456"
				})
				.set("Authorization", `Basic ${expiredToken}`)
				.expect(401)
				.expect({ message: 'Auth type must be a Bearer' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken jwt is expired. Also, status should be 500", async () => {
			await request(app)
				.patch("/users/password")
				.send({
					"userId": "67238342c0fc8715b01cd479",
					"currentPassword": "123456",
					"newPassword": "123456"
				})
				.set("Authorization", `Bearer ${expiredToken}`)
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

	});

	describe("Add new Pokemon to user", () => {
		it("Should return the error object { message: 'Authorization header must be provided' } if the acessToken is not provided. Also, status should be 400", async () => {
			await request(app)
				.post("/users/pokemons")
				.send({ userId: "66fe98882196cc6333471aab", pokemons: pokemonFixture })
				.expect(401)
				.expect({ message: 'Authorization header must be provided' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken is not a valid jwt. Also, status should be 500", async () => {
			await request(app)
				.post("/users/pokemons")
				.send({ userId: "66fe98882196cc6333471aab", pokemons: pokemonFixture })
				.set("Authorization", "Bearer invalid-token")
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

		it("Should return the error object { message: 'Auth type must be a Bearer' } if the provded authentication tyoe is not a valid Bearer, like Basic. Also, status should be 500", async () => {
			await request(app)
				.post("/users/pokemons")
				.send({ userId: "66fe98882196cc6333471aab", pokemons: pokemonFixture })
				.set("Authorization", `Basic ${expiredToken}`)
				.expect(401)
				.expect({ message: 'Auth type must be a Bearer' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken jwt is expired. Also, status should be 500", async () => {
			await request(app)
				.post("/users/pokemons")
				.send({ userId: "66fe98882196cc6333471aab", pokemons: pokemonFixture })
				.set("Authorization", `Bearer ${expiredToken}`)
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

	})

	describe("Get pokemons from an user", () => {
		it("Should return the error object { message: 'Authorization header must be provided' } if the acessToken is not provided. Also, status should be 400", async () => {
			await request(app)
				.get("/users/pokemons")
				.expect(401)
				.expect({ message: 'Authorization header must be provided' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken is not a valid jwt. Also, status should be 500", async () => {
			await request(app)
				.get("/users/pokemons")
				.set("Authorization", "Bearer invalid-token")
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

		it("Should return the error object { message: 'Auth type must be a Bearer' } if the provded authentication tyoe is not a valid Bearer, like Basic. Also, status should be 500", async () => {
			await request(app)
				.get("/users/pokemons")
				.set("Authorization", `Basic ${expiredToken}`)
				.expect(401)
				.expect({ message: 'Auth type must be a Bearer' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken jwt is expired. Also, status should be 500", async () => {
			await request(app)
				.get("/users/pokemons")
				.set("Authorization", `Bearer ${expiredToken}`)
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});
	})

	describe("Delete pokemon from user", () => {
		it("Should return the error object { message: 'Authorization header must be provided' } if the acessToken is not provided. Also, status should be 400", async () => {
			await request(app)
				.delete("/users/pokemons/3")
				.expect(401)
				.expect({ message: 'Authorization header must be provided' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken is not a valid jwt. Also, status should be 500", async () => {
			await request(app)
				.delete("/users/pokemons/3")
				.set("Authorization", "Bearer invalid-token")
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

		it("Should return the error object { message: 'Auth type must be a Bearer' } if the provded authentication tyoe is not a valid Bearer, like Basic. Also, status should be 500", async () => {
			await request(app)
				.delete("/users/pokemons/3")
				.set("Authorization", `Basic ${expiredToken}`)
				.expect(401)
				.expect({ message: 'Auth type must be a Bearer' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken jwt is expired. Also, status should be 500", async () => {
			await request(app)
				.delete("/users/pokemons/3")
				.set("Authorization", `Bearer ${expiredToken}`)
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});
	})

	describe("Get one pokemon by its id", () => {
		it("Should return the error object { message: 'Authorization header must be provided' } if the acessToken is not provided. Also, status should be 400", async () => {
			await request(app)
				.get("/pokemons/1")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.expect(401)
				.expect({ message: 'Authorization header must be provided' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken is not a valid jwt. Also, status should be 500", async () => {
			await request(app)
				.get("/pokemons/1")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.set("Authorization", "Bearer invalid-token")
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

		it("Should return the error object { message: 'Auth type must be a Bearer' } if the provded authentication tyoe is not a valid Bearer, like Basic. Also, status should be 500", async () => {
			await request(app)
				.get("/pokemons/1")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.set("Authorization", `Basic ${expiredToken}`)
				.expect(401)
				.expect({ message: 'Auth type must be a Bearer' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken jwt is expired. Also, status should be 500", async () => {
			await request(app)
				.get("/pokemons/1")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.set("Authorization", `Bearer ${expiredToken}`)
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

	});

	describe("Get a list of all pokemons", () => {
		it("Should return the error object { message: 'Authorization header must be provided' } if the acessToken is not provided. Also, status should be 400", async () => {
			await request(app)
				.get("/pokemons")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.expect(401)
				.expect({ message: 'Authorization header must be provided' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken is not a valid jwt. Also, status should be 500", async () => {
			await request(app)
				.get("/pokemons")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.set("Authorization", "Bearer invalid-token")
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

		it("Should return the error object { message: 'Auth type must be a Bearer' } if the provded authentication tyoe is not a valid Bearer, like Basic. Also, status should be 500", async () => {
			await request(app)
				.get("/pokemons")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.set("Authorization", `Basic ${expiredToken}`)
				.expect(401)
				.expect({ message: 'Auth type must be a Bearer' })
		});

		it("Should return the error object { message: 'Invalid auth token' } if the provded acessToken jwt is expired. Also, status should be 500", async () => {
			await request(app)
				.get("/pokemons")
				.send({ "expiredToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzIwZjg5YzQ0ZGFiNGM2YzlhNjYzM2IiLCJpYXQiOjE3MzAyMTQwNDQsImV4cCI6MTczMDIxNzY0NH0.P1ZdsLA9X_HJM4c9IrQo3Glt3FnEeEOQ8sptqtMq8ZQ" })
				.set("Authorization", `Bearer ${expiredToken}`)
				.expect(500)
				.expect({ message: 'Invalid auth token' })
		});

	})
})
