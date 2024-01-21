import { PokemonsService } from '../../../services/pokemons.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, catchError, delay, of, switchMap, takeUntil } from 'rxjs';
import { EvolutionsService } from 'src/app/services/evolution.service';
import { SpeciesService } from 'src/app/services/species.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonDetailComponent implements OnChanges, OnDestroy {
  @Input() pokemonDetails: any = null;
  @Output() setName = new EventEmitter<string>();
  evolutions: any;
  evolutionPic: any[] = [];
  loading = false;
  protected unsubscribeAll = new Subject<boolean>();

  constructor(
    private speciesService: SpeciesService,
    private evolutionService: EvolutionsService,
    private pokemonsService: PokemonsService,
    private cdr: ChangeDetectorRef
    ) {  }

    ngOnChanges(): void {
    this.loading = true;

    this.speciesService.getSpecie(this.pokemonDetails.species.url)
      .pipe(
        takeUntil(this.unsubscribeAll),
        switchMap(specie => this.evolutionService.getEvolution(specie.evolution_chain.url)),
        catchError(error => {
          console.error('Error fetching data:', error);
          return of(null);
        })
      )
      .subscribe({
        next: async (evolution: any) => {
        if(!evolution) {
          return;
        }
        const evolutionNames = await this.extractEvolutionNames(evolution.chain);
        this.evolutions = evolutionNames;

        evolutionNames.forEach((element: string, i: number) => {
          this.getEvolutionImages(element, i);
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(true);
  }

  extractEvolutionNames(evolution: any, result: any[] = []): any {
    result.push(evolution.species.name);

    if (evolution.evolves_to.length > 0) {
      this.extractEvolutionNames(evolution.evolves_to[0], result);
    }

    return result;
  }


  setNameDetail(event: any): void {
    this.setName.emit(event);
  }

  getEvolutionImages(speciesName: string, i: number): void {
    this.pokemonsService
    .getPokemon(speciesName)
    .pipe(
        takeUntil(this.unsubscribeAll),
        delay(1000)
      )
      .subscribe({
        next: (value) => {
          if (value && value.sprites && value.sprites.front_default) {
            this.evolutionPic[i] = value.sprites.front_default;
            this.cdr.detectChanges();
          } else {
            console.warn('No evolution image found.');
          }
        },
        error: (error) => {
          console.error('Error fetching evolution image:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }
}
