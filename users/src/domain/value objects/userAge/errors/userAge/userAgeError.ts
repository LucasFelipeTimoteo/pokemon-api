import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class UserAgeError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "UserAgeError";
	}
}
