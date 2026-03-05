import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PokemonService } from "./pokemon.service";
import { Pokemon } from "./pokemon.types";

@Component({
  selector: "app-pokemon-list",
  templateUrl: "./pokemon-list.component.html",
  styleUrl: "./pokemon-list.component.scss",
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  searchTerm: string = "";
  filteredPokemon: Pokemon[] = [];
  isLoading: boolean = false;
  offset: number = 0;
  limit: number = 20;
  total: number = 0;
  hasMoreResults: boolean = true;

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPokemonList();
  }

  loadPokemonList(): void {
    if (!this.hasMoreResults) return;

    this.isLoading = true;
    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: (response) => {
        this.pokemonList = [...this.pokemonList, ...response.results];
        this.filteredPokemon = [...this.pokemonList];
        this.total = response.total;
        this.offset += this.limit;
        this.hasMoreResults = this.pokemonList.length < this.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading pokemon list:", error);
        this.isLoading = false;
      },
    });
  }

  loadMore(): void {
    this.loadPokemonList();
  }

  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPokemon = [...this.pokemonList];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.isLoading = true;

    this.pokemonService.searchPokemon(this.searchTerm).subscribe({
      next: (response) => {
        this.filteredPokemon = response.results;
        this.isLoading = false;
      },
      error: () => {
        this.filteredPokemon = [];
        this.isLoading = false;
      },
    });
  }

  viewDetails(pokemon: Pokemon): void {
    this.router.navigate(["/details", pokemon.name]);
  }
}
