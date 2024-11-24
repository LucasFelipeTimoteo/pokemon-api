export interface RawPokemonsResults {
	name: string;
	url: string;
}

export interface RawPokemons {
	count: number;
	next: string | null;
	previous: string | null;
	results: RawPokemonsResults[];
}
