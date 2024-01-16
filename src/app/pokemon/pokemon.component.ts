import { Component } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { FormBuilder } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';

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
        debounceTime(800), // Wait for 800ms pause in events
        distinctUntilChanged(), // Only emit when the current value is different from the last
        tap(() => (this.loading = true)),
        switchMap(() => {
          return this.pokemonService.getPokemon(
            this.searchForm.get('searchQuery').value
            ).pipe(
              catchError(() => {
                return of(null); // Return an empty observable to continue the chain
              })
            )
          }// Make the API call
        )
      )
      .subscribe((data: any) => {
        if (data) {
          this.pokemon = data;
        } else {
          this.pokemon = null;
        }
        this.loading = false;
      }),
      (error: any) => {
        console.log(error)
      };
  }
}
