export interface Ability {
	name: string;
}

export interface Move {
	name: string;
}

export interface Type {
	name: string;
}

export interface Stat {
	name: string;
	base_stat: number;
	effort: number;
}

export interface Pokemon {
	pokemon_id: number;
	name: string;
	height: number;
	weight: number;
	abilities: Ability[];
	moves: Move[];
	types: Type[];
	stats: Stat[];
}
