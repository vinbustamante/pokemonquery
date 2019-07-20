import { injectable, inject } from 'inversify';
import { IPokemonService } from '../../IPokemonService';
import { CacheMissedException } from '../../exception/CacheMissedException';
import { CacheExpiredException } from '../../exception/CacheExpiredException';
import { IFileCacheService } from '../../IFileCacheService';
import { PokemonService } from '../PokemonService';
import { PokemonDto } from '../../dto/PokemonDto';
import * as path from 'path';
import { types as serviceTypes } from '../../types';

@injectable()
export class PokemonCacheableService extends PokemonService implements IPokemonService {

    @inject(serviceTypes.IFileCacheService)
    private readonly _fileCacheService: IFileCacheService;

    @inject(serviceTypes.BashShell)
    private readonly _shell: any;

    getRecord(value: string): Promise<PokemonDto> {
        const fileName: string = this._genFileName(value);
        return this._fileCacheService
            .get(fileName)
            .catch(err => {
                if (err instanceof CacheMissedException || err instanceof CacheExpiredException) {
                    return super.getRecord(value)
                        .then(pokemon => {
                            return this._writeCacheFile(pokemon);
                        });
                } else {
                    return Promise.reject(err);
                }
            });
    }

    private async _writeCacheFile(pokemon: PokemonDto): Promise<any> {
        // write id file
        const idFile = this._genFileById(pokemon.id);
        await this._fileCacheService.set(idFile, pokemon);

        // write link name file
        const nameFile = this._genFileByName(pokemon.name);
        this._shell.exec(`ln -s ${idFile} ${nameFile} > /dev/null 2>&1`);
        return pokemon;
    }

    private _genFileName(value: string) {
        let fileName: string;
        if (this._isId(value)) {
            fileName = this._genFileById(value);
        } else {
            fileName = this._genFileByName(value);
        }
        return fileName;
    }

    private _genFileById(value: string) {
        return path.join(__dirname, '../../../../../', 'data', 'id', `${value}.json`);
    }

    private _genFileByName(value: string) {
        return path.join(__dirname, '../../../../../', 'data', 'name', `${value}.json`);
    }

    private _isId(value: string) {
        const id = Number.parseInt(value, 10);
        return isNaN(id) === false;
    }
}