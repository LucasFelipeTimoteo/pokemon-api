import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonTypesError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonTypesError";
	}
}
