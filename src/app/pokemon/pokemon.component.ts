import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
})
export class PokemonComponent {
  pokemon: any = [];
  searchForm: any;

  constructor(
    private pokemonService: PokemonService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      searchQuery: [null],
    });

    this.searchForm
      .get('searchQuery')
      .valueChanges.pipe(
        debounceTime(1000), // Wait for 300ms pause in events
        distinctUntilChanged(), // Only emit when the current value is different from the last
        switchMap(() =>
          this.pokemonService.getPokemon(
            this.searchForm.get('searchQuery').value
          )
        ) // Make the API call
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.pokemon = [data];
        }
      });
  }
}
