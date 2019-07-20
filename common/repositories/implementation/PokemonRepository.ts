import { injectable } from 'inversify';
import { HttpRepositoryBase } from './HttpRepositoryBase';
import { IPokemonRepository } from '../IPokemonRepository';
import { HttpMethodEnum } from '../../enum/HttpMethodEnum';

@injectable()
export class PokemonRepository extends HttpRepositoryBase implements IPokemonRepository {

    getModelClass(): any {
        return () => {}
    }

    getById(id: string): Promise<any> {
        return this.request({
            url: `/pokemon/${id}`,
            method: HttpMethodEnum.get
        });
    }
    getByName(name: string): Promise<any> {
        return this.request({
            url: `/pokemon/${name}`,
            method: HttpMethodEnum.get
        });
    }
}