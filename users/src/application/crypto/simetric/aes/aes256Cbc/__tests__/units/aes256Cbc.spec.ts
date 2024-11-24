import { Aes256Cbc } from "../../aes256cbc"; // ajuste o caminho conforme necessário

describe("Aes256Cbc", () => {
	const secret = "mysecretkey";
	const aes = new Aes256Cbc(secret);

	it("should encrypt data correctly", () => {
		const data = "Hello, World!";
		const encryptedData = aes.encryptData(data);

		expect(encryptedData).not.toBe(data);
		expect(typeof encryptedData).toBe("string");
	});

	it("should decrypt data correctly", () => {
		const data = "Hello, World!";
		const encryptedData = aes.encryptData(data);
		const decryptedData = aes.decryptData(encryptedData);

		expect(decryptedData).toBe(data);
	});

	it("should return different encrypted results for the same input", () => {
		const data = "Hello, World!";
		const encryptedData1 = aes.encryptData(data);
		const encryptedData2 = aes.encryptData(data);

		expect(encryptedData1).not.toBe(encryptedData2);
	});

	it("should throw an error when decrypting modified data", () => {
		const data = "Hello, World!";
		const encryptedData = aes.encryptData(data);
		const corruptedEncryptedData = `${encryptedData.slice(0, -1)}A`;

		expect(() => aes.decryptData(corruptedEncryptedData)).toThrow();
	});
});
