import crypto from "node:crypto";

export class Aes256Cbc {
	private encryptionMethod = "aes-256-cbc";

	constructor(private secret: string) {
		this.secret = crypto
			.createHash("sha256")
			.update(this.secret)
			.digest("hex")
			.substring(0, 32);
	}

	encryptData(data: string): string {
		const iv = crypto.randomBytes(16);
		const cipher = crypto.createCipheriv(
			this.encryptionMethod,
			this.secret,
			iv,
		);

		const encrypted = Buffer.concat([
			cipher.update(data, "utf8"),
			cipher.final(),
		]);

		// concat the iv with encrypted data
		return Buffer.concat([iv, encrypted]).toString("base64");
	}

	decryptData(encryptedData: string): string {
		const encryptedBuffer = Buffer.from(encryptedData, "base64");
		const iv = encryptedBuffer.subarray(0, 16);
		const encryptedText = encryptedBuffer.subarray(16);
		const decipher = crypto.createDecipheriv(
			this.encryptionMethod,
			this.secret,
			iv,
		);

		const decrypted = Buffer.concat([
			decipher.update(encryptedText),
			decipher.final(),
		]);

		return decrypted.toString("utf8");
	}
}
