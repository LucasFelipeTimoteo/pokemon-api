import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class UserPasswordError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "UserPasswordError";
	}
}
