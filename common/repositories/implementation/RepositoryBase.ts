import * as _ from 'underscore';
import { injectable, inject } from 'inversify';
import { types as commonServiceTypes } from '../../services/types';
import { IReflectionService } from '../../services/IReflectionService';

@injectable()
export abstract class RepositoryBase {

    @inject(commonServiceTypes.IReflectionService)
    protected _reflectionService: IReflectionService;

    abstract getModelClass(): any;

    protected toModel(source: any) {
        return this._reflectionService.createObjectFrom(this.getModelClass(), source);
    }
}