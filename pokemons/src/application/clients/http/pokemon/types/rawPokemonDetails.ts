export interface RawAbility {
	is_hidden: boolean;
	slot: number;
	ability: {
		name: string;
		url: string;
	};
}

export interface RawForm {
	name: string;
	url: string;
}

export interface RawGameIndex {
	game_index: number;
	version: {
		name: string;
		url: string;
	};
}

export interface RawHeldItem {
	item?: {
		name: string;
		url: string;
	};
	version_details?: {
		rarity: number;
		version: {
			name: string;
			url: string;
		};
	}[];
}

export interface RawMove {
	move: {
		name: string;
		url: string;
	};
	version_group_details: {
		level_learned_at: number;
		version_group: {
			name: string;
			url: string;
		};
		move_learn_method: {
			name: string;
			url: string;
		};
	}[];
}

export interface RawPastType {
	generation: {
		name: string;
		url: string;
	};
	types: RawType[];
}

export interface RawSprite {
	back_default: string | null;
	back_female: string | null;
	back_shiny: string | null;
	back_shiny_female: string | null;
	front_default: string | null;
	front_female: string | null;
	front_shiny: string | null;
	front_shiny_female: string | null;
}

export interface RawCries {
	latest: string | null;
	legacy: string | null;
}

export interface RawStat {
	stat: {
		name: string;
		url: string;
	};
	effort: number;
	base_stat: number;
}

export interface RawType {
	slot: number;
	type: {
		name: string;
		url: string;
	};
}

export interface RawPokemonDetails {
	id: number;
	name: string;
	base_experience: number;
	height: number;
	is_default: boolean;
	order: number;
	weight: number;
	abilities: RawAbility[];
	forms: RawForm[];
	game_indices: RawGameIndex[];
	held_items: RawHeldItem[];
	location_area_encounters: string;
	moves: RawMove[];
	past_types: RawPastType[];
	sprites: RawSprite;
	cries: RawCries;
	species: {
		name: string;
		url: string;
	};
	stats: RawStat[];
	types: RawType[];
}
