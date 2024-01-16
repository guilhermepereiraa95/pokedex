import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
})
export class PokemonComponent {
  pokemon: any;
  searchForm: any;
  loading = false;

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
        debounceTime(800), // Wait for 300ms pause in events
        distinctUntilChanged(), // Only emit when the current value is different from the last
        tap(() => (this.loading = true)),
        switchMap(() => {
          this.loading = true;
          this.pokemon = null;
          return this.pokemonService.getPokemon(
            this.searchForm.get('searchQuery').value
            ) }// Make the API call
          )
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data) {
          this.pokemon = data;
        }
        this.loading = false;
      });
  }
}
