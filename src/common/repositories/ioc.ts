import { Container } from "inversify";
import { types as commonRepositoryTypes } from "./types";

import { IPokemonRepository } from "./IPokemonRepository";
import { PokemonRepository } from "./implementation/PokemonRepository";

import { IEncounterRepository } from "./IEncounterRepository";
import { EncounterRepository } from "./implementation/EncounterRepository";

import { ILocationAreaRepository } from "./ILocationAreaRepository";
import { LocationAreaRepository } from "./implementation/LocationAreaRepository";

export function configureCommonRepositories(container: Container): Container {
  container
    .bind<IPokemonRepository>(commonRepositoryTypes.IPokemonRepository)
    .to(PokemonRepository)
    .inSingletonScope();
  container
    .bind<IEncounterRepository>(commonRepositoryTypes.IEncounterRepository)
    .to(EncounterRepository)
    .inSingletonScope();
  container
    .bind<ILocationAreaRepository>(
      commonRepositoryTypes.ILocationAreaRepository
    )
    .to(LocationAreaRepository)
    .inSingletonScope();
  return container;
}
