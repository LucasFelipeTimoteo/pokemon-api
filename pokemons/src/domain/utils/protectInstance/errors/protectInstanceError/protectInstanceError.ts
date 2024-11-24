import type { ProtectInstanceErrorType } from "./types/protectInstanceErrorType";

export class ProtectInstanceError
	extends Error
	implements ProtectInstanceErrorType
{
	constructor(public message: string) {
		super(message);

		Error.captureStackTrace(this, this.constructor);
	}
}
