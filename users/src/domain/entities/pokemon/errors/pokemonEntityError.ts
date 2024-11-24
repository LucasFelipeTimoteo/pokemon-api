import { DomainObjectError } from "../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonEntityError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonEntityError";
	}
}
