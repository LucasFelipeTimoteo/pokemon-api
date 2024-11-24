import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonHeightError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonHeightError";
	}
}
