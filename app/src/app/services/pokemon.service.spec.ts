import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PokemonService } from './pokemon.service';
import { provideHttpClient } from '@angular/common/http';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:3000/api/pokemon';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PokemonService
      ]
    });
    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve buscar a lista de pokemon com limit e offset', () => {
    const mockResponse = { results: [], count: 0 };
    service.getPokemonList(10, 5).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/list?limit=10&offset=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve buscar um pokemon pelo nome (search)', () => {
    service.searchPokemon('pikachu').subscribe();
    const req = httpMock.expectOne(`${apiUrl}/search?name=pikachu`);
    expect(req.request.method).toBe('GET');
  });

  it('deve buscar detalhes de um pokemon', () => {
    service.getPokemonDetail('bulbasaur').subscribe();
    const req = httpMock.expectOne(`${apiUrl}/bulbasaur`);
    expect(req.request.method).toBe('GET');
  });
});
