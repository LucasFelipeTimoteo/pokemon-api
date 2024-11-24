import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonMovesError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonMovesError";
	}
}
