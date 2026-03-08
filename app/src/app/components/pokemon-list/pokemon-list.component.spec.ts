import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { PokemonListComponent } from './pokemon-list.component';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    pokemonServiceMock = {
      getPokemonList: jest.fn().mockReturnValue(of({ results: [] })),
      searchPokemon: jest.fn().mockReturnValue(of({ results: [{ name: 'pikachu' }] }))
    };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [PokemonListComponent, ReactiveFormsModule],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve carregar a lista inicial no ngOnInit', () => {
    expect(pokemonServiceMock.getPokemonList).toHaveBeenCalled();
  });

  it('deve navegar para detalhes ao chamar viewDetails', () => {
    const mockPoke = { name: 'mew' } as any;
    component.viewDetails(mockPoke);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/details', 'mew']);
  });

  it('deve resetar a lista corretamente', () => {
    component.resetList();
    expect(component.searchControl.value).toBe(null);
    expect(pokemonServiceMock.getPokemonList).toHaveBeenCalled();
  });
});
