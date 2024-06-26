import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';


  constructor(private http: HttpClient) { }

  getPokemon(name?: string, params?: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/${name}`, {
      params: params
    }
    ).pipe(delay(1000));
  }

  // it wasnt needed to use these apis, as everything is beeing made by the same api call above
  // but ill let these apis calls commented bellow anyway

  // getPokemonList(pagination: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${pagination}`).pipe(delay(1000));
  // }

  // getPokemonById(id: any): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${id}`).pipe(delay(1000))
  // }
}
