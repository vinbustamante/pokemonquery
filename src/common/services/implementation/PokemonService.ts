import { injectable, inject } from "inversify";
import { IPokemonService } from "../IPokemonService";
import { types as serviceTypes } from "../types";
import { IReflectionService } from "../IReflectionService";
import { IPokemonRepository } from "../../repositories/IPokemonRepository";
import { types as repositoryTypes } from "../../repositories/types";
import { PokemonDto } from "../dto/PokemonDto";
import { PokemonStatDto } from "../dto/PokemonStatDto";
import { IEncounterService } from "../IEncounterService";

@injectable()
export class PokemonService implements IPokemonService {
  @inject(repositoryTypes.IPokemonRepository)
  private _pokemonRepository: IPokemonRepository;

  @inject(serviceTypes.IReflectionService)
  protected _reflectionService: IReflectionService;

  @inject(serviceTypes.IEncounterService)
  private _encounterService: IEncounterService;

  getRecord(value: string): Promise<PokemonDto> {
    return this._pokemonRepository
      .getRecord(value)
      .then(async response => {
        return this._toDto(response);
      })
      .then(async dto => {
        if (dto && dto.id) {
          dto.encounters = await this._encounterService.getById(dto.id);
        }
        return dto;
      });
  }

  private _toDto(response: any) {
    let info;
    if (response) {
      info = new PokemonDto();
      info.id = response.id;
      info.name = response.name;
      info.types = this._toTypes(response.types);
      info.stats = this._toStats(response.stats);
    }
    return info;
  }

  private _toTypes(types): string[] {
    const values = [];
    if (this._reflectionService.isArray(types)) {
      types.forEach(item => {
        if (item && item.type && item.type.name) {
          values.push(item.type.name);
        }
      });
    }
    return values;
  }

  private _toStats(stats): PokemonStatDto[] {
    const values: PokemonStatDto[] = [];
    if (this._reflectionService.isArray(stats)) {
      stats.forEach(stat => {
        if (stat && stat.stat) {
          values.push({
            name: stat.stat.name,
            base_stat: stat.base_stat,
            effort: stat.effort
          });
        }
      });
    }
    return values;
  }
}
