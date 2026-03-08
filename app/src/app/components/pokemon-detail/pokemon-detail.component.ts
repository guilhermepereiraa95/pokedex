import { Component, OnDestroy, ChangeDetectionStrategy, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PokemonService } from "../../services/pokemon.service";
import { PokemonDetail } from "../../interfaces/pokemon.interface";
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  finalize,
  map,
  of,
  switchMap,
  takeUntil,
} from "rxjs";
import { StatsColor, STATS_COLOR_THRESHOLDS } from "../../enums/stats-color.enum";
import { POKEMON_TYPE_COLORS } from "../../enums/pokemon-types.enum";

@Component({
  selector: "app-pokemon-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pokemon-detail.component.html",
  styleUrls: ["./pokemon-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pokemonService = inject(PokemonService);

  private destroy$ = new Subject<void>();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  isLoading$ = this.isLoadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  pokemonDetail$: Observable<PokemonDetail | null> = this.route.params.pipe(
    map((params) => params["name"] as string),
    switchMap((name) => {
      if (!name) return of(null);

      this.errorSubject.next(null);
      this.isLoadingSubject.next(true);

      return this.pokemonService.getPokemonDetail(name).pipe(
        catchError((error) => {
          this.errorSubject.next(`Failed to load Pokemon: ${error.message}`);
          return of(null);
        }),
        finalize(() => this.isLoadingSubject.next(false)),
      );
    }),
    takeUntil(this.destroy$),
  );
  pokemon: PokemonDetail | null = null;

  ngOnInit(): void {
    this.pokemonDetail$.subscribe((detail) => {
          this.pokemon = detail;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(["/"]);
  }

  getStatColor(value: number): string {
    if (value >= STATS_COLOR_THRESHOLDS.EXCELLENT) return StatsColor.EXCELLENT;
    if (value >= STATS_COLOR_THRESHOLDS.VERY_GOOD) return StatsColor.VERY_GOOD;
    if (value >= STATS_COLOR_THRESHOLDS.GOOD) return StatsColor.GOOD;
    if (value >= STATS_COLOR_THRESHOLDS.FAIR) return StatsColor.FAIR;
    return StatsColor.POOR;
  }

  getStatKeys(pokemon: PokemonDetail | null): string[] {
    return pokemon ? Object.keys(pokemon.stats) : [];
  }

  getPokemonTypeColor(type: string): string {
    return POKEMON_TYPE_COLORS[type.toLowerCase() as keyof typeof POKEMON_TYPE_COLORS] || '#999999';
  }
}
