import { Controller, Get, Query, Param } from "@nestjs/common";
import { PokemonService } from "../../service/pokemon.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller("pokemon")
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get("list")
  @ApiOperation({ summary: 'Get list of Pokémons with limit and offset' })
  async getPokemonList(
    @Query("limit") limit: string = "20",
    @Query("offset") offset: string = "0"
  ) {
    return this.pokemonService.getPokemonList(
      parseInt(limit, 10),
      parseInt(offset, 10)
    );
  }

  @Get("search")
  @ApiOperation({ summary: 'Search Pokémon by name' })
  async searchPokemon(@Query("name") name: string) {
    if (!name) {
      return { results: [] };
    }
    const result = await this.pokemonService.searchPokemon(name);
    return { results: result ? [result] : [] };
  }

  @Get(":name")
  @ApiOperation({ summary: 'Search Pokémon details' })
  async getPokemonDetail(@Param("name") name: string) {
    return this.pokemonService.getPokemonDetail(name);
  }
}
