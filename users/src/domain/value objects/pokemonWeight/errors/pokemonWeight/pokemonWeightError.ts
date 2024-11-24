import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonWeightError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonWeightError";
	}
}
