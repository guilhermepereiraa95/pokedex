import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon: any = null;
  pokemonDetails: any = null;
  constructor() { }

  onDetail(): void {
    this.pokemonDetails = this.pokemon;
    this.pokemon = null;
  }
}
