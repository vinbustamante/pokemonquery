import { injectable, inject } from "inversify";
import { EncounterDto } from "../dto/EncounterDto";
import { IEncounterService } from "../IEncounterService";
import { IConfigService } from "../IConfigService";
import { IReflectionService } from "../IReflectionService";
import { IFlowService } from "../IFlowService";
import { IEncounterRepository } from "../../repositories/IEncounterRepository";
import { ILocationAreaRepository } from "../../repositories/ILocationAreaRepository";
import { types as repositoryTypes } from "../../repositories/types";
import { types as serviceTypes } from "../types";
import * as _ from "underscore";

@injectable()
export class EncounterService implements IEncounterService {
  @inject(repositoryTypes.IEncounterRepository)
  private readonly _encounterRepository: IEncounterRepository;

  @inject(repositoryTypes.ILocationAreaRepository)
  private readonly _locationAreaRepository: ILocationAreaRepository;

  @inject(serviceTypes.IConfigService)
  private readonly _configService: IConfigService;

  @inject(serviceTypes.IReflectionService)
  private readonly _reflectionService: IReflectionService;

  @inject(serviceTypes.IFlowService)
  private readonly _flowService: IFlowService;

  getById(id: string): Promise<EncounterDto[]> {
    return this._encounterRepository
      .getById(id)
      .then(response => {
        return this._filterRecords(response);
      })
      .then(records => {
        //parallel request to server
        return this._flowService
          .each(records, record => {
            return this._toMethods(record).then(methods => {
              record.methods = methods;
            });
          })
          .then(() => {
            return records;
          });
      });
  }

  private _filterRecords(locations): any {
    const records = [];
    const validLocations = this._configService.getLocationFilters();
    if (this._reflectionService.isArray(locations)) {
      locations.forEach(item => {
        if (item && item.location_area) {
          const location = item.location_area;
          if (location.name) {
            const names = location.name.split("-");
            if (validLocations.indexOf(names[0]) >= 0) {
              const locationDto = new EncounterDto();
              locationDto.locationName = location.name;
              if (location.url) {
                const parts = location.url.split("/");
                locationDto.locationId = parts[parts.length - 2];
              }
              records.push(locationDto);
            }
          }
        }
      });
    }
    return records;
  }

  private async _toMethods(record): Promise<string[]> {
    let values = [];
    if (this._reflectionService.isObject(record) && record.locationId) {
      const response = await this._locationAreaRepository.getById(
        record.locationId
      );
      if (
        this._reflectionService.isObject(response) &&
        this._reflectionService.isArray(response.encounter_method_rates)
      ) {
        response.encounter_method_rates.forEach(encounter => {
          if (encounter && encounter.encounter_method) {
            values.push(encounter.encounter_method.name);
          }
        });
      }
      values = _.uniq(values);
    }
    return values;
  }
}
