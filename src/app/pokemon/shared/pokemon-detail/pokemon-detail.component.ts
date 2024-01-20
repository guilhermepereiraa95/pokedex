import { PokemonService } from './../../../services/pokemon.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';
import { EvolutionsService } from 'src/app/services/evolution.service';
import { SpeciesService } from 'src/app/services/species.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonDetailComponent implements OnChanges {
  @Input() pokemonDetails: any = null;
  @Output() setName = new EventEmitter<string>();
  evolutions: any;
  evolutionPic: any[] = [];
  loading = false;

  constructor(
    private speciesService: SpeciesService,
    private evolutionService: EvolutionsService,
    private pokemonService: PokemonService,
    private cdr: ChangeDetectorRef
    ) {  }

    ngOnChanges(): void {
    this.loading = true;

    this.speciesService.getSpecie(this.pokemonDetails.species.url)
      .pipe(
        switchMap(specie => this.evolutionService.getEvolution(specie.evolution_chain.url)),
        catchError(error => {
          console.error('Error fetching data:', error);
          return of(null); // Return an observable with a default value (e.g., null) in case of an error
        })
      )
      .subscribe((evolution: any) => {

        const evolutionNames = this.extractEvolutionNames(evolution.chain);
        this.evolutions = evolutionNames;

        evolutionNames.forEach((element: string, i: number) => {
          this.getEvolutionImages(element, i);
        });
      });
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
    this.pokemonService.getPokemon(speciesName)
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
