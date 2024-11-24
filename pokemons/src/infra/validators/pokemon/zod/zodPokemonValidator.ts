import z, { type ZodError } from "zod";
import type { PokemonValidator } from "../../../../application/validation/pokemon/pokemonValidator";
import type { Pokemon } from "../../../../domain/entities/pokemon/types/pokemon";

class ZodPokemonValidator implements PokemonValidator<ZodError> {
	rawPokemonDetails(rawPokemon: unknown) {
		const RawAbilitySchema = z.object({
			is_hidden: z.boolean(),
			slot: z.number(),
			ability: z.object({
				name: z.string(),
				url: z.string(),
			}),
		});

		const RawFormSchema = z.object({
			name: z.string(),
			url: z.string(),
		});

		const RawGameIndexSchema = z.object({
			game_index: z.number(),
			version: z.object({
				name: z.string(),
				url: z.string(),
			}),
		});

		const RawHeldItemSchema = z.object({
			item: z
				.object({
					name: z.string(),
					url: z.string(),
				})
				.optional(),
			version_details: z
				.array(
					z.object({
						rarity: z.number(),
						version: z.object({
							name: z.string(),
							url: z.string(),
						}),
					}),
				)
				.optional(),
		});

		const RawMoveSchema = z.object({
			move: z.object({
				name: z.string(),
				url: z.string(),
			}),
			version_group_details: z.array(
				z.object({
					level_learned_at: z.number(),
					version_group: z.object({
						name: z.string(),
						url: z.string(),
					}),
					move_learn_method: z.object({
						name: z.string(),
						url: z.string(),
					}),
				}),
			),
		});

		const RawSpriteSchema = z.object({
			back_default: z.string().nullable(),
			back_female: z.string().nullable(),
			back_shiny: z.string().nullable(),
			back_shiny_female: z.string().nullable(),
			front_default: z.string().nullable(),
			front_female: z.string().nullable(),
			front_shiny: z.string().nullable(),
			front_shiny_female: z.string().nullable(),
		});

		const RawStatSchema = z.object({
			base_stat: z.number(),
			effort: z.number(),
			stat: z.object({
				name: z.string(),
				url: z.string(),
			}),
		});

		const RawTypeSchema = z.object({
			slot: z.number(),
			type: z.object({
				name: z.string(),
				url: z.string(),
			}),
		});

		const RawPastTypeSchema = z.object({
			generation: z.object({
				name: z.string(),
				url: z.string(),
			}),
			types: z.array(RawTypeSchema),
		});

		const RawCries = z.object({
			latest: z.string().nullable(),
			legacy: z.string().nullable(),
		});

		const RawPokemonDetailsSchema = z.object({
			id: z.number().min(1),
			name: z.string().min(1),
			base_experience: z.number(),
			height: z.number(),
			is_default: z.boolean(),
			order: z.number(),
			weight: z.number(),
			abilities: z.array(RawAbilitySchema),
			forms: z.array(RawFormSchema),
			game_indices: z.array(RawGameIndexSchema),
			held_items: z.array(RawHeldItemSchema),
			location_area_encounters: z.string(),
			moves: z.array(RawMoveSchema),
			species: z.object({
				name: z.string(),
				url: z.string(),
			}),
			sprites: RawSpriteSchema,
			stats: z.array(RawStatSchema),
			types: z.array(RawTypeSchema),
			past_types: z.array(RawPastTypeSchema),
			cries: RawCries,
		});

		const result = RawPokemonDetailsSchema.safeParse(rawPokemon);

		return result;
	}

	rawPokemons(unvalidatedRawPokemons: unknown) {
		const rawPokemonsSchema = z.object({
			count: z.number().min(1),
			next: z.union([z.string(), z.null()]),
			previous: z.union([z.string(), z.null()]),
			results: z
				.object({
					name: z.string().min(1),
					url: z.string().min(1),
				})
				.array(),
		});

		const result = rawPokemonsSchema.safeParse(unvalidatedRawPokemons);

		return result;
	}

	pokemon(unvalidatedPokemon: Pokemon) {
		const AbilitySchema = z.object({
			name: z.string().min(1),
		});

		const MoveSchema = z.object({
			name: z.string().min(1),
		});

		const TypeSchema = z.object({
			name: z.string().min(1),
		});

		const StatSchema = z.object({
			name: z.string().min(1),
			base_stat: z.number(),
			effort: z.number(),
		});

		const PokemonSchema = z.object({
			pokemon_id: z.number().min(1),
			name: z.string().min(1),
			height: z.number().min(1),
			weight: z.number(),
			abilities: z.array(AbilitySchema),
			moves: z.array(MoveSchema),
			types: z.array(TypeSchema),
			stats: z.array(StatSchema),
		});

		const validatedPokemon = PokemonSchema.safeParse(unvalidatedPokemon);

		return validatedPokemon;
	}
}

export const zodPokemonValidator = new ZodPokemonValidator();
