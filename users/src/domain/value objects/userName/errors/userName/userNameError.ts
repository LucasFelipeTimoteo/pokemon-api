import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class UserNameError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "UserNameError";
	}
}
