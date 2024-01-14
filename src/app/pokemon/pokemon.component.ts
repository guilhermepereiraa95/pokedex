import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html'
})
export class PokemonComponent implements OnInit {
  pokemonName = 'charizard';
  pokemon: any = [];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit(): void {
    this.loadPokemon();
  }

  loadPokemon(): void {
    if(this.pokemonName === ""){
      return;
    }

    this.pokemonService.getPokemon(this.pokemonName).subscribe(data => {
      if(data) {
        this.pokemon = [data];
      }
    });
  }

}
