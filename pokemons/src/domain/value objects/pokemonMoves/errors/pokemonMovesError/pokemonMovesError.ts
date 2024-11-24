import { DomainObjectError } from "../../../../errors/domainObjectsErrors/domainObjectErrors";

export class PokemonMovesError extends DomainObjectError {
	constructor(public messsage: string) {
		super(messsage);
	}
}
