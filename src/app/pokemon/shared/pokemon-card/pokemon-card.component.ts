import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon: any = null;
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
