import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { routes } from './pokedex-app.routes';
import { PokedexAppComponent } from "./pokedex-app.component";
import { PokemonService } from "./pokemon/pokemon.service";
import { PokemonListComponent } from "./pokemon/pokemon-list.component";
import { PokemonDetailComponent } from "./pokemon/pokemon-detail.component";

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    PokemonService,
  ],
  declarations: [
    PokedexAppComponent,
    PokemonListComponent,
    PokemonDetailComponent,
  ],
  bootstrap: [PokedexAppComponent],
})
export class PokedexAppModule {}
