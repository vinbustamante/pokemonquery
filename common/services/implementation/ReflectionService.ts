import * as _ from 'underscore';
import { injectable } from 'inversify';
import { plainToClass } from "class-transformer";
import * as objectPath from 'object-path';
import { IReflectionService } from '../IReflectionService';

@injectable()
export class ReflectionService implements IReflectionService {

    isArray(value: any): boolean {
        return _.isArray(value);
    }

    createObjectFrom(klass: any, objectSource: object): any {
        let model: any;
        if (klass && objectSource) {
            model = plainToClass(klass, objectSource);
        }
        return model;
    }

    objectToConstructor(instance): any {
        if (_.isFunction(instance)) {
            return instance;
        } else {
            return instance.constructor;
        }
    }

    readObjectValue(obj: any, key: string): any {
        return objectPath.get(obj, key);
    }
}