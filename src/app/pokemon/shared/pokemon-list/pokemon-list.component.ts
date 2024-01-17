import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss']
})
export class PokemonListComponent {
  @Input() pokemonList: any[] = [];
  @Output() setName = new EventEmitter<string>();

  constructor() {  }

  setSearchName(name: any) {
    this.setName.emit(name)
  }
}
