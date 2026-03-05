import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { PokemonService } from "../../services/pokemon.service";
import { PokemonDetail } from "../../interfaces/pokemon.types";

@Component({
  selector: "app-pokemon-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./pokemon-detail.component.html",
  styleUrls: ["./pokemon-detail.component.scss"],
})
export class PokemonDetailComponent implements OnInit {
  pokemon: PokemonDetail | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["name"]) {
        this.loadPokemonDetail(params["name"]);
      }
    });
  }

  loadPokemonDetail(name: string): void {
    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPokemonDetail(name).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = `Failed to load Pokemon: ${error.message}`;
        this.isLoading = false;
      },
    });
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

  getStatKeys(): string[] {
    return this.pokemon ? Object.keys(this.pokemon.stats) : [];
  }
}
