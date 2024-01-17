import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';


  constructor(private http: HttpClient) { }

  getPokemon(name?: string, params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`, {
      params: params
    }
    ).pipe(delay(1000));
  }

  // getPokemonList(pagination: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${pagination}`).pipe(delay(1000));
  // }

  // getPokemonById(id: any): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${id}`).pipe(delay(1000))
  // }
}
