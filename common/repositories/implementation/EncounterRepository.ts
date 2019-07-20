import { injectable } from 'inversify';
import { IEncounterRepository } from '../IEncounterRepository';
import { HttpRepositoryBase } from './HttpRepositoryBase';
import { HttpMethodEnum } from '../../enum/HttpMethodEnum';

@injectable()
export class EncounterRepository extends HttpRepositoryBase implements IEncounterRepository {

    getModelClass(): any {
        return () => {}
    }

    getById(id: string): Promise<any> {
        return this.request({
            url: `/pokemon/${id}/encounters`,
            method: HttpMethodEnum.get
        });
    }
}