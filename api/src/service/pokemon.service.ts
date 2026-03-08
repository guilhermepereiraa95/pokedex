import { Injectable } from "@nestjs/common";
import axios from "axios";
import { Pokemon, PokemonDetail } from "../interface/pokemon.interface";

const POKEAPI_URL = "https://pokeapi.co/api/v2";

@Injectable()
export class PokemonService {
  async getPokemonList(limit: number = 20, offset: number = 0): Promise<{ results: Pokemon[]; total: number }> {
    try {
      const response = await axios.get(`${POKEAPI_URL}/pokemon?limit=${limit}&offset=${offset}`);
      const total = response.data.count;

      const results = await Promise.all(
        response.data.results.map((pokemon: any) =>
          this.fetchPokemonDetails(pokemon.name)
        )
      );

      return { results, total };
    } catch (error) {
      throw new Error(`Failed to fetch pokemon list: ${error}`);
    }
  }

  async searchPokemon(name: string): Promise<Pokemon | null> {
    try {
      const normalizedName = name.toLowerCase().trim();
      const response = await axios.get(`${POKEAPI_URL}/pokemon/${normalizedName}`);
      return this.formatPokemon(response.data);
    } catch (error) {
      return null;
    }
  }

  async getPokemonDetail(name: string): Promise<PokemonDetail> {
    try {
      const normalizedName = name.toLowerCase().trim();
      const response = await axios.get(`${POKEAPI_URL}/pokemon/${normalizedName}`);
      const data = response.data;

      return {
        id: data.id,
        name: data.name,
        sprite: data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default || "",
        types: data.types.map((t: any) => t.type.name),
        height: data.height,
        weight: data.weight,
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: Object.fromEntries(
          data.stats.map((stat: any) => [stat.stat.name, stat.base_stat])
        ),
      };
    } catch (error) {
      throw new Error(`Pokemon "${name}" not found`);
    }
  }

  private async fetchPokemonDetails(name: string): Promise<Pokemon> {
    const response = await axios.get(`${POKEAPI_URL}/pokemon/${name}`);
    return this.formatPokemon(response.data);
  }

  private formatPokemon(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      sprite: data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default || "",
      types: data.types.map((t: any) => t.type.name),
    };
  }
}
