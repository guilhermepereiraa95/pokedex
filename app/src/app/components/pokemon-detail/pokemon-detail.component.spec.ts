import { STATS_COLOR_THRESHOLDS, StatsColor } from './../../enums/stats-color.enum';
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

  it('should get pokemon name when Detail is called', () => {
    expect(pokemonServiceMock.getPokemonDetail).toHaveBeenCalledWith('pikachu');
    expect(component.pokemon?.name).toBe('pikachu');
  });

  it('should navigate to home when goBack', () => {
    component.goBack();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should return EXCELLENT color for values >= 100', () => {
    expect(component.getStatColor(100)).toBe(StatsColor.EXCELLENT);
    expect(component.getStatColor(150)).toBe(StatsColor.EXCELLENT);
  });

  it('should return VERY_GOOD color for values between 80 and 99', () => {
    expect(component.getStatColor(80)).toBe(StatsColor.VERY_GOOD);
    expect(component.getStatColor(99)).toBe(StatsColor.VERY_GOOD);
  });
  it('should return stat keys when pokemon detail is available', () => {
    const keys = component.getStatKeys(component.pokemon);
    expect(keys).toContain('hp');
  });

  it('should return an empty array for getStatKeys if pokemon is null', () => {
    expect(component.getStatKeys(null)).toEqual([]);
  });

});
