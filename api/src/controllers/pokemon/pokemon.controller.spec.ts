import { Test, TestingModule } from "@nestjs/testing";
import { PokemonController } from "../pokemon/pokemon.controller";
import { PokemonService } from "../../services/pokemon.service";

describe("PokemonController", () => {
  let controller: PokemonController;
  let service: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: PokemonService,
          useValue: {
            getPokemonList: jest.fn(),
            searchPokemon: jest.fn(),
            getPokemonDetail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    service = module.get<PokemonService>(PokemonService);
  });

  describe("getPokemonList", () => {
    it("should return paginated pokemon list", async () => {
      const mockData = {
        results: [
          {
            id: 1,
            name: "bulbasaur",
            sprite: "https://example.com/bulbasaur.png",
            types: ["grass", "poison"],
          },
        ],
        total: 1025,
      };

      jest.spyOn(service, "getPokemonList").mockResolvedValueOnce(mockData);

      const result = await controller.getPokemonList("20", "0");

      expect(result).toEqual(mockData);
      expect(service.getPokemonList).toHaveBeenCalledWith(20, 0);
    });

    it("should parse query parameters correctly", async () => {
      const mockData = { results: [], total: 0 };
      jest.spyOn(service, "getPokemonList").mockResolvedValueOnce(mockData);

      await controller.getPokemonList("10", "50");

      expect(service.getPokemonList).toHaveBeenCalledWith(10, 50);
    });
  });

  describe("searchPokemon", () => {
    it("should return search results", async () => {
      const mockData = {
        results: [
          {
            id: 1,
            name: "bulbasaur",
            sprite: "https://example.com/bulbasaur.png",
            types: ["grass", "poison"],
          },
        ],
      };

      jest
        .spyOn(service, "searchPokemon")
        .mockResolvedValueOnce(mockData.results[0]);

      const result = await controller.searchPokemon("bulbasaur");

      expect(result.results).toHaveLength(1);
      expect(result.results[0].name).toBe("bulbasaur");
    });

    it("should return empty results if pokemon not found", async () => {
      jest.spyOn(service, "searchPokemon").mockResolvedValueOnce(null);

      const result = await controller.searchPokemon("nonexistent");

      expect(result.results).toHaveLength(0);
    });

    it("should return empty results if name is empty", async () => {
      const result = await controller.searchPokemon("");

      expect(result.results).toHaveLength(0);
      expect(service.searchPokemon).not.toHaveBeenCalled();
    });
  });

  describe("getPokemonDetail", () => {
    it("should return pokemon detail", async () => {
      const mockData = {
        id: 1,
        name: "bulbasaur",
        sprite: "https://example.com/bulbasaur.png",
        types: ["grass", "poison"],
        height: 7,
        weight: 69,
        abilities: ["overgrow"],
        stats: { hp: 45, attack: 49 },
      };

      jest.spyOn(service, "getPokemonDetail").mockResolvedValueOnce(mockData);

      const result = await controller.getPokemonDetail("bulbasaur");

      expect(result).toEqual(mockData);
      expect(service.getPokemonDetail).toHaveBeenCalledWith("bulbasaur");
    });
  });
});
