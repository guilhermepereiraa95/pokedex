import { Component, OnDestroy } from '@angular/core';
import { PokemonsService } from '../services/pokemons.service';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, catchError, debounceTime, of, switchMap, takeUntil, tap } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
})
export class PokemonComponent implements OnDestroy {
  pokemon: Pokemon | null = null;
  searchForm: FormGroup;
  loading = false;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100, 200];
  protected unsubscribeAll = new Subject<boolean>();

  constructor(
    private pokemonsService: PokemonsService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      searchQuery: [null],
    });

    this.searchValueChange();
  }

  searchValueChange(): void {
    this.searchQuery
      .valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll),
        debounceTime(800),
        tap(() => {
          this.loading = true;
          this.pokemon = null
        }),
        switchMap((value: string) => {
          return this.pokemonsService.getPokemon(value.toLocaleLowerCase(), {
            offset: this.pageIndex,
            limit: this.pageSize
          })
          .pipe(
              catchError(() => {
                return of(null); // Return an empty observable to continue the chain
              })
            )
          }// Make the API call
        )
      )
      .subscribe({
        next: (data: Pokemon) => {
        this.pokemon = data;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error.message)
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
  }

  setName(name: string): void {
    this.searchQuery.setValue(name.toLocaleLowerCase());
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.searchQuery.setValue('');
  }

  get searchQuery(): any {
    return this.searchForm.get('searchQuery');
  }
}
