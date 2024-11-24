import bcrypt from "bcryptjs";
import type { PasswordHasher } from "../../../../../application/parsers/password/hasing/passwordHasher";

export class HashPasswordBcrypt implements PasswordHasher {
	async genSalt(rounds: number): Promise<string> {
		const salt = await bcrypt.genSalt(rounds);
		return salt;
	}

	genSaltSync(rounds: number): string {
		const salt = bcrypt.genSaltSync(rounds);
		return salt;
	}

	async hashAsync(text: string, salt: string): Promise<string> {
		const hash = await bcrypt.hash(text, salt);
		return hash;
	}

	hashSync(text: string, salt: string): string {
		const hash = bcrypt.hashSync(text, salt);
		return hash;
	}

	async compare(text: string, hash: string): Promise<boolean> {
		const isEqual = await bcrypt.compare(text, hash);
		return isEqual;
	}
}
