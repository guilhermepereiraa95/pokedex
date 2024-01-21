import { Component, OnDestroy } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';
import { FormBuilder } from '@angular/forms';
import { Subject, catchError, debounceTime, of, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
})
export class PokemonComponent implements OnDestroy {
  pokemon: any  = '';
  searchForm: any;
  loading = false;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100, 200];
  protected unsubscribeAll = new Subject<boolean>();

  constructor(
    private pokemonService: PokemonService,
    private formBuilder: FormBuilder
  ) {
    this.searchForm = this.formBuilder.group({
      searchQuery: [''],
    });

    this.searchValueChange();
  }

  searchValueChange(): void {
    this.searchForm
      .get('searchQuery')
      .valueChanges
      .pipe(
        takeUntil(this.unsubscribeAll),
        debounceTime(800),
        tap(() => {
          this.loading = true;
          this.pokemon = null;
        }),
        switchMap((value: string) => {
          return this.pokemonService.getPokemon(value.toLocaleLowerCase(), {
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
      .subscribe((data: any) => {
        this.pokemon = data ? data : null;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
  }

  setName(name: string): void {
    this.searchForm.get('searchQuery').setValue(name.toLocaleLowerCase());
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.searchForm.get('searchQuery').setValue('');
  }
}
