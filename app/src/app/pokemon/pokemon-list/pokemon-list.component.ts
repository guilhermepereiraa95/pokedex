import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, switchMap, tap } from "rxjs/operators";
import { PokemonService } from "../../services/pokemon.service";
import { Pokemon } from "../../interfaces/pokemon.types";

@Component({
  selector: "app-pokemon-list",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./pokemon-list.component.html",
  styleUrls: ["./pokemon-list.component.scss"]
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  displayList: Pokemon[] = [];
  searchControl = new FormControl('');

  isLoading = false;
  offset = 0;
  limit = 20;

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit(): void {
    this.loadPokemonList();

    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => this.isLoading = true),
      switchMap(term => {
        if (!term?.trim()) return [];
        return this.pokemonService.searchPokemon(term.trim());
      })
    ).subscribe({
      next: (resp: any) => {

        this.displayList = this.searchControl.value ? resp.results : this.pokemonList;
        this.isLoading = false;
      },
      error: () => {
        this.displayList = [];
        this.isLoading = false;
      }
    });
  }

  loadPokemonList(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe(response => {
      this.pokemonList = [...this.pokemonList, ...response.results];

      if (!this.searchControl.value) {
        this.displayList = this.pokemonList;
      }
      this.offset += this.limit;
      this.isLoading = false;
    });
  }

  viewDetails(pokemon: Pokemon) {
    this.router.navigate(["/details", pokemon.name]);
  }
}
