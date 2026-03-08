import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonDetailComponent } from './pokemon-detail.component';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('PokemonDetailComponent', () => {
  let component: PokemonDetailComponent;
  let fixture: ComponentFixture<PokemonDetailComponent>;
  let pokemonServiceMock: jest.Mocked<Partial<PokemonService>>;
  let routerMock: jest.Mocked<Partial<Router>>;

  beforeEach(async () => {
    pokemonServiceMock = {
      getPokemonDetail: jest.fn().mockReturnValue(of({ name: 'pikachu', stats: { hp: 100 } }))
    };
    routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [PokemonDetailComponent],
      providers: [
        { provide: PokemonService, useValue: pokemonServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ name: 'pikachu' }) }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve buscar detalhes do pokemon baseado no parâmetro da URL', () => {
    expect(pokemonServiceMock.getPokemonDetail).toHaveBeenCalledWith('pikachu');
    expect(component.pokemon?.name).toBe('pikachu');
  });

  it('deve navegar de volta para a home ao clicar em goBack', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
