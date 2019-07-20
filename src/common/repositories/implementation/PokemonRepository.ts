import { injectable } from 'inversify';
import { HttpRepositoryBase } from './HttpRepositoryBase';
import { IPokemonRepository } from '../IPokemonRepository';
import { HttpMethodEnum } from '../../enum/HttpMethodEnum';

@injectable()
export class PokemonRepository extends HttpRepositoryBase implements IPokemonRepository {

    async getRecord(value: string): Promise<any> {
        return this.request({
            url: `/pokemon/${value}`,
            method: HttpMethodEnum.get
        });
    }
}