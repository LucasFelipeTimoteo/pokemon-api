import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonAbilitiesError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonAbilitiesError";
	}
}
