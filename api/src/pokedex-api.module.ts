import { Module } from '@nestjs/common';
import { PokemonService } from './service/pokemon.service';
import { PokemonController } from './controller/pokemon.controller';

@Module({
  imports: [],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokedexApiModule {}
