import 'reflect-metadata';
import * as expect from 'expect';
import * as sinon from 'sinon';
import { LocationAreaRepository } from '../../../src/common/repositories/implementation/LocationAreaRepository';

describe('LocationAreaRepository', () => {
    let _locationRepository;

    beforeEach(() => {
        _locationRepository = new LocationAreaRepository();
        sinon.stub(_locationRepository, 'request');
    });

    describe('getById()', () => {
        it('it should call back request method', async () => {
            const id = 1;
            await _locationRepository.getById(id);
            expect(_locationRepository.request.callCount).toBe(1);
            const arg = _locationRepository.request.getCall(0).args[0];
            expect(arg.url).toBe(`/location-area/${id}`);
            expect(arg.method).toBe('GET');
        });
    });
});