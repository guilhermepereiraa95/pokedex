import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonService: jest.Mocked<PokemonService>;
  let router: jest.Mocked<Router>;

  const mockPokemon = {
    id: 1,
    name: 'pikachu',
    sprite: 'https://example.com/pikachu.png',
    types: ['electric'],
  };

  beforeEach(async () => {
    const pokemonServiceMock = {
      getPokemonList: jest.fn().mockReturnValue(
        of({ results: [mockPokemon], total: 1 })
      ),
      searchPokemon: jest.fn().mockReturnValue(
        of({ results: [mockPokemon] })
      ),
      getPokemonDetail: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PokemonListComponent],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    pokemonService = TestBed.inject(PokemonService) as jest.Mocked<PokemonService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pokemon list on init', () => {
    fixture.detectChanges();
    expect(pokemonService.getPokemonList).toHaveBeenCalled();
  });

  it('should display pokemon list', (done) => {
    component.displayList$.subscribe((list) => {
      expect(Array.isArray(list)).toBe(true);
      done();
    });
  });

  it('should navigate to pokemon detail', () => {
    fixture.detectChanges();
    component.viewDetails(mockPokemon);
    expect(router.navigate).toHaveBeenCalledWith(['/details', mockPokemon.name]);
  });

  it('should reset search list', (done) => {
    fixture.detectChanges();
    component.searchControl.setValue('test');
    component.resetList();

    setTimeout(() => {
      expect(component.searchControl.value).toBeNull();
      done();
    }, 100);
  });

  it('should return color for pokemon type', () => {
    fixture.detectChanges();
    const color = component.getPokemonTypeColor('electric');
    expect(color).toBeTruthy();
  });
});
