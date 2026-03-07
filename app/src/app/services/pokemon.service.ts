import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PokemonDetail, PokemonListResponse, PokemonSearchResponse } from "../interfaces/pokemon.types";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  private apiUrl = "http://localhost:3000/api/pokemon";

  constructor(private http: HttpClient) {}

  getPokemonList(limit: number = 20, offset: number = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}/list?limit=${limit}&offset=${offset}`
    );
  }

  searchPokemon(name: string): Observable<PokemonSearchResponse> {
    return this.http.get<PokemonSearchResponse>(
      `${this.apiUrl}/search?name=${name}`
    );
  }

  getPokemonDetail(name: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(`${this.apiUrl}/${name}`);
  }
}
