import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class UserIdError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "UserIdError";
	}
}
