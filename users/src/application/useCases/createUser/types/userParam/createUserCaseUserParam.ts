import type { User } from "../../../../../domain/entities/user/types/user";

export type CreateUserCaseUserParam = Omit<User, "userId" | "pokemons">;
