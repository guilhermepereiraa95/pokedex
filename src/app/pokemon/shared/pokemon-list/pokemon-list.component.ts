import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from 'src/app/interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html'
})
export class PokemonListComponent {
  @Input() pokemonList?: Pokemon[] = [];
  @Output() setName = new EventEmitter<string>();

  constructor() {  }

  setSearchName(name?: string) {
    this.setName.emit(name);
  }
}
