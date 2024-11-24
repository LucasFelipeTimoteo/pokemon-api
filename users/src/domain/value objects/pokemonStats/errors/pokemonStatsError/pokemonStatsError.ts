import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonStatsError extends DomainObjectError {
	constructor(public message: string) {
		super(message);
		this.name = "PokemonStatsError";
	}
}
