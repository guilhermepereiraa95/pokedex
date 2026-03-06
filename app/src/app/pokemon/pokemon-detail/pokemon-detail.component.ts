import { Component, OnDestroy, ChangeDetectionStrategy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PokemonService } from "../../services/pokemon.service";
import { PokemonDetail } from "../../interfaces/pokemon.types";
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

@Component({
  selector: "app-pokemon-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pokemon-detail.component.html",
  styleUrls: ["./pokemon-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

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
    if (value >= 100) return "#4CAF50";
    if (value >= 80) return "#8BC34A";
    if (value >= 60) return "#FFC107";
    if (value >= 40) return "#FF9800";
    return "#F44336";
  }

  getStatKeys(pokemon: PokemonDetail | null): string[] {
    return pokemon ? Object.keys(pokemon.stats) : [];
  }
}
