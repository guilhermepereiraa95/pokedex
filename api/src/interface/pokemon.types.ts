export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  abilities: string[];
  stats: Record<string, number>;
}

export interface PokemonListResponse {
  results: Pokemon[];
  total: number;
}

export interface PokemonSearchResponse {
  results: Pokemon[];
}
