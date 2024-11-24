import { WebBFFPokemonRouter } from "./BFFs/web/router/pokemons/webBFFPokemonRouter";
import { WebBFFUsersRouter } from "./BFFs/web/router/usersRouter/webBFFUsersRouter";
import { Entrypoint } from "./entrypoint";
import { pinoLogger } from "./global/logger/pino/pinoLogger";
import { Server } from "./server";

const webBFFPokemonRouter = new WebBFFPokemonRouter();
const webBFFUsersRouter = new WebBFFUsersRouter();

const server = new Server(webBFFPokemonRouter, webBFFUsersRouter);
const entrypoint = new Entrypoint(server, pinoLogger);

entrypoint.listen();
