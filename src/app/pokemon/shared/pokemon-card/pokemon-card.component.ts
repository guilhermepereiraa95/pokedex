import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pokemon } from 'src/app/interfaces/pokemon.interface';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html'
})
export class PokemonCardComponent {
  @Input() pokemon?: Pokemon | null;
  @Input() loading = false;
  pokemonDetails: any = null;
  @Output() setName = new EventEmitter<string>();

  constructor() { }
  setNameEvent(event: any): void {
    this.setName.emit(event);
  }

  onDetail(): void {
    this.pokemonDetails = this.pokemon;
    this.pokemon = null;
  }
}
