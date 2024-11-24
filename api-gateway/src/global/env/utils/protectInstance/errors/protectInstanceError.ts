export class ProtectInstanceError extends Error {
	constructor(public message: string) {
		super(message);

		Error.captureStackTrace(this, this.constructor);
	}
}
