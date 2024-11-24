export interface PasswordHasher {
	genSalt(rounds: number): Promise<string>;
	genSaltSync(rounds: number): string;
	hashAsync(text: string, salt: string): Promise<string>;
	hashSync(text: string, salt: string): string;
	compare(text: string, hash: string): Promise<boolean>;
}
