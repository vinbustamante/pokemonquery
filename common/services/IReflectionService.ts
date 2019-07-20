export interface IReflectionService {
    isArray(value: any): boolean;
    isObject(value: any): boolean;
    createObjectFrom(klass: any, objectSource: object): any;
    objectToConstructor(instance): any;
    readObjectValue(obj: any, key: string): any;
    toJson(value: string): any;
}