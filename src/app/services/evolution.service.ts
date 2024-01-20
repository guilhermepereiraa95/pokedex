import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EvolutionsService {

  constructor(private http: HttpClient) { }

  getEvolution(url: string): Observable<any> {
    return this.http.get(`${url}`);
  }
}
