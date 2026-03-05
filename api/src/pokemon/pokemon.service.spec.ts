import { Test, TestingModule } from "@nestjs/testing";
import { PokemonService } from "./pokemon.service";
import axios from "axios";

jest.mock("axios");

describe("PokemonService", () => {
  let service: PokemonService;
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokemonService],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPokemonList", () => {
    it("should return a list of pokemon with pagination", async () => {
      const mockResponse = {
        data: {
          count: 1025,
          results: [
            { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
            { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
          ],
        },
      };

      const mockPokemonDetails = {
        data: {
          id: 1,
          name: "bulbasaur",
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/bulbasaur.png",
              },
            },
          },
          types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);
      mockedAxios.get.mockResolvedValueOnce(mockPokemonDetails);
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          id: 2,
          name: "ivysaur",
          sprites: { front_default: "https://example.com/ivysaur.png" },
          types: [{ type: { name: "grass" } }],
        },
      });

      const result = await service.getPokemonList(2, 0);

      expect(result.total).toBe(1025);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe("bulbasaur");
    });
  });

  describe("searchPokemon", () => {
    it("should find a pokemon by name", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "bulbasaur",
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/bulbasaur.png",
              },
            },
          },
          types: [{ type: { name: "grass" } }],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.searchPokemon("bulbasaur");

      expect(result).not.toBeNull();
      expect(result?.name).toBe("bulbasaur");
    });

    it("should return null for non-existent pokemon", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Not found"));

      const result = await service.searchPokemon("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getPokemonDetail", () => {
    it("should return detailed pokemon information", async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: "bulbasaur",
          sprites: {
            other: {
              "official-artwork": {
                front_default: "https://example.com/bulbasaur.png",
              },
            },
          },
          types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
          height: 7,
          weight: 69,
          abilities: [
            { ability: { name: "overgrow" } },
            { ability: { name: "chlorophyll" } },
          ],
          stats: [
            { stat: { name: "hp" }, base_stat: 45 },
            { stat: { name: "attack" }, base_stat: 49 },
            { stat: { name: "defense" }, base_stat: 49 },
          ],
        },
      };

      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getPokemonDetail("bulbasaur");

      expect(result.id).toBe(1);
      expect(result.name).toBe("bulbasaur");
      expect(result.height).toBe(7);
      expect(result.weight).toBe(69);
      expect(result.abilities).toHaveLength(2);
      expect(result.stats["hp"]).toBe(45);
    });

    it("should throw error for non-existent pokemon", async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error("Not found"));

      await expect(service.getPokemonDetail("nonexistent")).rejects.toThrow(
        'Pokemon "nonexistent" not found'
      );
    });
  });
});
