import { Module } from "@nestjs/common";
import { PokemonService } from "./service/pokemon.service";
import { PokemonController } from "./controller/pokemon/pokemon.controller";
import { HealthCheckController } from "./controller/healthcheck/healtcheck.controller";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [PokemonController, HealthCheckController],
  providers: [PokemonService],
})
export class PokedexApiModule {}
