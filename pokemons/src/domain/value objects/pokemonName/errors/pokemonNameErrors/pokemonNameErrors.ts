import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonNameError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
	}
}
