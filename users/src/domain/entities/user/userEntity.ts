import { protectInstance } from "../../utils/protectInstance/protectinstance";
import { UserAge } from "../../value objects/userAge/userAge";
import { UserName } from "../../value objects/userName/userName";
import { UserPassword } from "../../value objects/userPassword/userPassword";
import type { Pokemon } from "../pokemon/types/pokemon";
import { UserIdEntity } from "../userId/userIdEntity";
import type { User } from "./types/user";

export class UserEntity implements User {
	constructor(
		public username: string,
		public age: number,
		public password: string,
		public pokemons: Pokemon[] = [],
		public userId?: string,
	) {
		this.username = new UserName(username).username;
		this.age = new UserAge(age).age;
		this.pokemons = pokemons;
		this.password = new UserPassword(password).password;

		if (userId) {
			this.userId = new UserIdEntity(userId).userId;
		}

		protectInstance(this, true);
	}
}
