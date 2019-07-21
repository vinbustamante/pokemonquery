import * as expect from "expect";
import * as sinon from "sinon";
import { PokemonService } from "../../../src/common/services/implementation/PokemonService";

describe("PokemonService", () => {
  let _pokemonService;
  let _pokemonRepository;
  let _encounterService;
  let _reflectionService;

  beforeEach(() => {
    _reflectionService = {
      isArray: () => {}
    };
    sinon.stub(_reflectionService, "isArray");
    _reflectionService.isArray.callsFake(() => {
      return true;
    });

    _encounterService = {
      getById: () => {}
    };
    sinon.stub(_encounterService, "getById");
    _encounterService.getById.callsFake(() => {
      return Promise.resolve([]);
    });

    _pokemonRepository = {
      getRecord: () => {}
    };
    sinon.stub(_pokemonRepository, "getRecord");
    _pokemonRepository.getRecord.callsFake(() => {
      return Promise.resolve({
        id: 1,
        name: "pikachu",
        types: [
          {
            type: {
              name: "electric"
            }
          }
        ],
        stats: [
          {
            stat: {
              name: "stat 1",
              base_stat: 0,
              effort: 1
            }
          }
        ]
      });
    });

    _pokemonService = new PokemonService();
    (<any>_pokemonService)._pokemonRepository = _pokemonRepository;
    (<any>_pokemonService)._encounterService = _encounterService;
    (<any>_pokemonService)._reflectionService = _reflectionService;
  });

  describe("getRecord()", () => {
    it("should call the pokemonRepository and encounterService", async () => {
      await _pokemonService.getRecord("pikachu");
      expect(_pokemonRepository.getRecord.callCount).toBe(1);
      expect(_pokemonRepository.getRecord.getCall(0).args[0]).toBe("pikachu");
      expect(_encounterService.getById.callCount).toBe(1);
      expect(_encounterService.getById.getCall(0).args[0]).toBe(1);
    });
  });
});
