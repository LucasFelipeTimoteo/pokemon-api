import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonIdError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonIdError";
	}
}
