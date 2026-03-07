import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PokemonDetailComponent } from './pokemon-detail.component';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let pokemonService: jest.Mocked<PokemonService>;
  let router: jest.Mocked<Router>;

  const mockPokemonDetail = {
    id: 25,
    name: 'pikachu',
    sprite: 'https://example.com/pikachu.png',
    types: ['electric'],
    height: 4,
    weight: 60,
    abilities: ['static', 'lightning-rod'],
    stats: {
      hp: 35,
      attack: 55,
      defense: 40,
      'sp-atk': 50,
      'sp-def': 50,
      speed: 90,
    },
  };

  beforeEach(async () => {
    const pokemonServiceMock = {
      getPokemonDetail: jest.fn().mockReturnValue(of(mockPokemonDetail)),
      getPokemonList: jest.fn(),
      searchPokemon: jest.fn(),
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    const activatedRouteSpy = {
      params: of({ name: 'pikachu' }),
    };

    await TestBed.configureTestingModule({
      imports: [PokemonDetailComponent],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;

    pokemonService = TestBed.inject(PokemonService) as jest.Mocked<PokemonService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getPokemonDetail on init', () => {
    fixture.detectChanges();
    expect(pokemonService.getPokemonDetail).toHaveBeenCalledWith('pikachu');
  });

  it('should display pokemon name', fakeAsync(() => {
    fixture.detectChanges();
    tick(100);
    expect(component.pokemon?.name).toBe('pikachu');
  }));

  it('should navigate back to home', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should return color for stat', () => {
    const color = component.getStatColor(55);
    expect(color).toBeDefined();
  });

  it('should return color for pokemon type', () => {
    const color = component.getPokemonTypeColor('electric');
    expect(color).toBeDefined();
  });
});
