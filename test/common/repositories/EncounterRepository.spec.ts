import 'reflect-metadata';
import * as expect from 'expect';
import * as sinon from 'sinon';
import { EncounterRepository } from '../../../src/common/repositories/implementation/EncounterRepository';

describe('EncounterRepository', () => {
    let _encounterRepository;

    beforeEach(() => {
        _encounterRepository = new EncounterRepository();
        sinon.stub(_encounterRepository, 'request');
    });

    describe('getById()', () => {
        it('it should call back request method', async () => {
            const id = 1;
            await _encounterRepository.getById(id);
            expect(_encounterRepository.request.callCount).toBe(1);
            const arg = _encounterRepository.request.getCall(0).args[0];
            expect(arg.url).toBe(`/pokemon/${id}/encounters`);
            expect(arg.method).toBe('GET');
        });
    });
});