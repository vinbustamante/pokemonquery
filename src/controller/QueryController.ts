import { injectable, inject } from 'inversify';
import { mapCommand } from '../common/decorator/mapCommand';
import { types as serviceTypes } from '../common/services/types';
import { IPokemonService } from '../common/services/IPokemonService';

@mapCommand('query')
@injectable()
export class QueryController {

    @inject(serviceTypes.IPokemonService)
    private _pokemonService: IPokemonService;

    execute(request: any) {
        const { queryValue} = request;
        return this._pokemonService.getRecord(queryValue);
    }

}