import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PokemonComponent } from './pokemon/pokemon.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PokemonListComponent } from './pokemon/shared/pokemon-list/pokemon-list.component';
import { PokemonCardComponent } from './pokemon/shared/pokemon-card/pokemon-card.component';
import { PokemonDetailComponent } from './pokemon/shared/pokemon-detail/pokemon-detail.component';


@NgModule({
  declarations: [
    AppComponent,
    PokemonComponent,
    PokemonListComponent,
    PokemonCardComponent,
    PokemonDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
