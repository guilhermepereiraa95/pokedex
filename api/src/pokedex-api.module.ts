import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { HttpModule } from "@nestjs/axios";
import { PokemonController } from "./controllers/pokemon/pokemon.controller";
import { HealthCheckController } from "./controllers/healthcheck/healtcheck.controller";
import { PokemonService } from "./services/pokemon.service";

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [PokemonController, HealthCheckController],
  providers: [PokemonService],
})
export class PokedexApiModule {}
