import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  startWith,
  map,
} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../interfaces/pokemon.types';
import { POKEMON_TYPE_COLORS } from '../../enums/pokemon-types.enum';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonListComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');

  private pokemonListSubject = new BehaviorSubject<Pokemon[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private offsetSubject = new BehaviorSubject<number>(0);

  displayList$: Observable<Pokemon[]>;
  isLoading$: Observable<boolean>;

  private offset = 0;
  private limit = 20;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
  ) {
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.displayList$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      tap(() => this.isLoadingSubject.next(true)),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        if (!term?.trim()) {
          return this.pokemonListSubject.asObservable();
        }
        return this.pokemonService
          .searchPokemon(term.trim())
          .pipe(map((resp: any) => resp.results || []));
      }),
      tap(() => this.isLoadingSubject.next(false)),
    );
  }

  ngOnInit(): void {
    this.loadPokemonList();
  }

  ngOnDestroy(): void {
    this.pokemonListSubject.complete();
    this.isLoadingSubject.complete();
    this.offsetSubject.complete();
  }

  loadPokemonList(): void {
    this.pokemonService
      .getPokemonList(this.limit, this.offset)
      .pipe(tap(() => this.isLoadingSubject.next(true)))
      .subscribe({
        next: (response) => {
          const updatedList = [
            ...this.pokemonListSubject.value,
            ...response.results,
          ];
          this.pokemonListSubject.next(updatedList);
          this.offset += this.limit;
        },
        complete: () => this.isLoadingSubject.next(false)
      });
  }

  resetList(): void {
    this.offset = 0;
    this.pokemonListSubject.next([]);
    this.searchControl.reset();
    this.loadPokemonList();
  }

  viewDetails(pokemon: Pokemon) {
    this.router.navigate(['/details', pokemon.name]);
  }

  getPokemonTypeColor(type: string): string {
    return POKEMON_TYPE_COLORS[type.toLowerCase() as keyof typeof POKEMON_TYPE_COLORS] || '#999999';
  }
}
