import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
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
import { Pokemon } from '../../interfaces/pokemon.interface';
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

  displayList$: Observable<Pokemon[]>;
  isLoading$: Observable<boolean>;

  private offset = 0;
  private limit = 20;
  private pokemonService = inject(PokemonService);
  private router = inject(Router);

  constructor() {
    this.isLoading$ = this.isLoadingSubject.asObservable();

    this.displayList$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) => {
        this.isLoadingSubject.next(true);
        if (!term?.trim()) {
          this.isLoadingSubject.next(false);
          return this.pokemonListSubject.asObservable();
        }
        return this.pokemonService
          .searchPokemon(term.trim())
          .pipe(
            map((resp) => {
              const results = resp.results || [];
              this.pokemonListSubject.next(results);
              return results;
            }),
            tap(() => this.isLoadingSubject.next(false)),
          );
      }),
    );
  }

  ngOnInit(): void {
    this.isLoadingSubject.next(true);
    this.loadPokemonList();
  }

  ngOnDestroy(): void {
    this.pokemonListSubject.complete();
    this.isLoadingSubject.complete();
  }

  loadPokemonList(): void {
    this.pokemonService
      .getPokemonList(this.limit, this.offset)
      .subscribe({
        next: (response) => {
          const updatedList = [
            ...this.pokemonListSubject.value,
            ...response.results,
          ];
          this.pokemonListSubject.next(updatedList);
          this.offset += this.limit;
          this.isLoadingSubject.next(false);
        },
      });
  }

  resetList(): void {
    this.isLoadingSubject.next(true);
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
