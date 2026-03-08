import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PokemonService } from '../../services/pokemon.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonDetail } from '../../interfaces/pokemon.interface';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let pokemonServiceMock: jest.Mocked<Partial<PokemonService>>;
  let routerMock: jest.Mocked<Partial<Router>>;

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
it('should load the initial list on ngOnInit', () => {
    expect(pokemonServiceMock.getPokemonList).toHaveBeenCalled();
  });

  it('should navigate to details when calling viewDetails', () => {
    const mockPoke = { name: 'mew' } as PokemonDetail;
    component.viewDetails(mockPoke);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/details', 'mew']);
  });

  it('should reset the list correctly', () => {
    component.resetList();
    expect(component.searchControl.value).toBe(null);
    expect(pokemonServiceMock.getPokemonList).toHaveBeenCalled();
  });

  it('should return the correct color for an existing pokemon type', () => {
    const color = component.getPokemonTypeColor('fire');
    expect(color).not.toBe('#999999');
  });

  it('should return the default color for a non-existent type', () => {
    const color = component.getPokemonTypeColor('non-existent-type');
    expect(color).toBe('#999999');
  });

  it('should emit the current list if the search term is empty on initialization', fakeAsync(() => {
    const initialList = { results: [{ name: 'pikachu' }] };
    (pokemonServiceMock.getPokemonList as jest.Mock).mockReturnValue(of(initialList));
    component.loadPokemonList();

    component.searchControl.setValue('');
    tick(500);

    component.displayList$.subscribe(list => {
      expect(list.length).toBe(1);
      expect(list[0].name).toBe('pikachu');
    });
  }));
});
