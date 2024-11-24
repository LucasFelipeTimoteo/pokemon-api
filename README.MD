<p align="center">
  <a href="https://github.com/LucasFelipeTimoteo/pokemon-api" title="Pokedex">
    <img src="https://github.com/LucasFelipeTimoteo/pokemon-api/blob/main/.github/assets/images/logo.svg" width="352px" alt="Pokedex"/>
  </a>
</p>
<h1 align="center">⚡Pokemon API⚡</h1>
<p align="center">Microservice-based API to get pokemon data and create your own custom pokedex.</p>
</p>

---
## 🚀 Features
- Get a list of Pokemon and their information
- Get information about a single Pokemon
- Create your own profile and your pokedex
- Get, Save, edit or remove Pokemon and other data in your profile and pokedex

## 🛠️ Installation Steps

### 1. Clone the repository

```Bash
git clone https://github.com/LucasFelipeTimoteo/pokemon-api
```

### 2. Download dependencies 

**LOCAL MACHINE SETUP:**
You can install deps, config git and git-hooks for services automatically by running the localSetup.sh script on project root. Just type:

```shell
sh localSetup.sh
```

Or you can run manually all this scripts at once, just coping and pasting on project root:

```Bash
cd api-gateway/ 
git init
npm install
npx husky install

cd ../pokemons/
git init
npm install
npx husky install

cd ../users/
git init
npm install
npx husky install
```

After all that, if you want, you can delete the .git from the root repository for an authentic "microservice experience"

> You can also run the project on docker

**DOCKER SETUP:**
You can config all docker containers automatically by running the dockerSetup.sh script on project root. Just type:

```shell
sh dockerSetup.sh
```

Or you can run manually containers with this scripts, just coping and pasting on project root:

```Bash
cd api-gateway/ 
docker compose up -d

cd ../pokemons/
docker compose up -d 

cd ../users/
docker compose up -d
```

## 🔥 Get Started
1. Each microservice should have has an ***.env*** file and some of this also a ***secret.env*** file. Each project have a boilerplate file for these with ***.test*** extension. You can use this data to test the application locally

2. In the ***.env*** file, make sure to set the ***APP_LOCAL***, ***APP_PORT***, ***DOCUMENTATION_APP_PORT*** and ***NODE_ENV*** properties according to your environment.
  - ***APP_LOCAL*** can be ***docker*** or ***local_machine***
  - ***NODE_ENV*** can be ***production***, ***development*** and ***test***

3. All services use the same script sintax to start. So, run the following script in the root folder of each service/api-gateway

### Local machine

development mode (if env "NODE_ENV" is "development"):
```Bash
npm run start:dev
```

production mode (if env "NODE_ENV" is "production"):
```Bash
npm run build
npm run start:prod
```

### docker
Just run the docker setup like said on 2º topic

## 💻 Using API
1º) in the api-gateway, create a new user in the POST route "/users". Pass an object in the body that has the format of this example: {username: "JohnDoe", age: 30, password: "123456"}

2º) After successfully creating a user, you will receive a response with Access Token and Refresh Token. Use the Access Token to authenticate to other endpoints. 

## 🧪 Tests
All microservices are using the same sintaxe for testing.

1. Run unit tests
```Bash
npm run test
```

2. Run E2E tests
```Bash
npm run test:e2e
```

3. Run all tests (units and E2E) at once + linter + dev build 
```Bash
npm run revise
```
## 📖 Motivations and technical explanations
Click [HERE](./technical-explanations.md) to see my technical explanations and motivation behind each decision in this project

## 👷 Built with
### Main Technologies
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/en/) (v20.12.2)
- [Typescript](https://www.typescriptlang.org/) 
- [Redis](https://redis.io/)
- [Mongo](https://www.mongodb.com/pt-br)
- [Mongoose](https://mongoosejs.com/)
- [Express](https://expressjs.com/)
- [Jest](https://jestjs.io/)
- [Zod](https://zod.dev/)
- [Pino](https://getpino.io/#/)
- [Swagger](https://swagger.io/)

### Main Concepts
- Clean Archtecture
- Microservices
- Tests and TDD
- OOP (Object-Oriented programming)
- Access Tokens and Refresh Tokens for auth
- DDD (Domain-Driven Design)
- Dependency Injection (DI)
- SOLID
- Cache

## 💡 Recomendações e Dicas

* Se deseja saber quais são os scripts disponíveis no projeto e não quer olhar manualmente o arquivo package.json, use o comando __***npm run scripts***__

* Só é possível rodar os testes e outros scripts diretamente dentro dos containers docker se a imagem usada for a de desenvolvimento. As imagens usadas em modo de produção são distroless, o que impede de rodar comandos shell

* Dependendo do seu editor e das configurações dele, algumas mensagens de erro de lint podem aparecer caso abra o projeto no raiz. Isso pode acontecer porque as configurações de lint e formatação locais do projeto não são carregadas no raiz. Para tirar prova que está tudo certo com o código, basta recomendo rodar o comando "npm run revise"

* Se desejar rodar os testes E2E localmente, assegure-se de colocar o valor da variável de ambiente **APP_LOCAL** para **"local_machine"**

<p align="center">Made with ❤️ by Lucas Felipe Timoteo</p>
