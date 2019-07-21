import * as expect from 'expect';
import { ReflectionService } from '../../../src/common/services/implementation/ReflectionService';

describe('ReflectionService', () => {
    let _reflectionService;

    beforeEach(() => {
        _reflectionService = new ReflectionService();
    });

    describe('isArray()', () => {
        it('should check string type', () => {
            expect(_reflectionService.isArray([])).toBe(true);
            expect(_reflectionService.isArray([1, 2, 3])).toBe(true);
            expect(_reflectionService.isArray()).toBe(false);
            expect(_reflectionService.isArray(1)).toBe(false);
            expect(_reflectionService.isArray('eee')).toBe(false);
        });
    });

    describe('isObject()', () => {
        it('should check type object', () => {
            expect(_reflectionService.isObject([])).toBe(true);
            expect(_reflectionService.isObject({})).toBe(true);
            expect(_reflectionService.isObject('eee')).toBe(false);
        });
    });

    describe('createObjectFrom', () => {
        it('it should create an object base on class', () => {
            const cust = _reflectionService.createObjectFrom(Customer, {name: 'marvin'});
            expect(cust.name).toBe('marvin');
        });
    });

    describe('objectToConstructor()', () => {
        it('should determing the constructor function properly', () => {
            expect(_reflectionService.objectToConstructor(Customer)).toBe(Customer);
            expect(_reflectionService.objectToConstructor(new Customer())).toBe(Customer);
        });
    });

    describe('readObjectValue()', () => {
        it('should be able to read property and subproperty', () => {
            const config = {
                name: {
                    firstname: 'marvin',
                    lastname: 'bustamante'
                },
                address: 'sigbapore'
            };
            expect(_reflectionService.readObjectValue(config, 'address')).toBe(config.address);
            expect(_reflectionService.readObjectValue(config, 'name.firstname')).toBe(config.name.firstname);
        });
    });

    describe('toObject()', () => {
        it('should convert string to object', () => {
            const customer = {
                name: 'marvin'
            };
            const json = JSON.stringify(customer);
            const result = _reflectionService.toObject(json);
            expect(JSON.stringify(result)).toBe(json);
        });

        it('should default to empty object if there was an error parsing', () => {
            expect(Object.keys(_reflectionService.toObject('xxx')).length).toBe(0);
        });

        it('should return the value if not string', () => {
            expect(_reflectionService.toObject(1)).toBe(1);
            expect(_reflectionService.toObject(false)).toBe(false);
        });
    });

    describe('toJson()', () => {
        it('should return the value if not an object', () => {
            expect(_reflectionService.toJson(1)).toBe(1);
            expect(_reflectionService.toJson(false)).toBe(false);
        });

        it('should be able to convert an object to string', () => {
            const cust = {
                name: 'marvin'
            };
            const json = JSON.stringify(cust);
            expect(_reflectionService.toJson(cust)).toBe(json);
        });
    });
});

class Customer {

}