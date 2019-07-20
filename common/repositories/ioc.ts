import { Container } from 'inversify';
import { types as commonRepositoryTypes } from './types';

import { IPokemonRepository } from './IPokemonRepository';
import { PokemonRepository } from './implementation/PokemonRepository';

export function configureCommonRepositories(container: Container): Container {
    container.bind<IPokemonRepository>(commonRepositoryTypes.IPokemonRepository).to(PokemonRepository).inSingletonScope();
    return container;
}