export class DomainObjectError extends Error {
	constructor(public message: string) {
		super(message);
		Error.captureStackTrace(this, this.constructor);
	}
}
