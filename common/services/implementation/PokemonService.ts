import { injectable, inject } from 'inversify';
import { IPokemonService } from '../IPokemonService';
import { IPokemonRepository } from '../../repositories/IPokemonRepository';
import { types as repositoryTypes } from '../../repositories/types';

@injectable()
export class PokemonService implements IPokemonService {

    @inject(repositoryTypes.IPokemonRepository)
    private _pokemonRepository: IPokemonRepository

    getById(id: string): Promise<any> {
        return this._pokemonRepository.getById(id);
    }

    getByName(name: string): Promise<any> {
        return this._pokemonRepository.getByName(name);
    }
}