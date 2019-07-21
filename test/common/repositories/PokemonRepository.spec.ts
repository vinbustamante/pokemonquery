import 'reflect-metadata';
import * as expect from 'expect';
import * as sinon from 'sinon';
import { PokemonRepository } from '../../../src/common/repositories/implementation/PokemonRepository';

describe('PokemonRepository', () => {
    let _pokemonRepository;

    beforeEach(() => {
        _pokemonRepository = new PokemonRepository();
        sinon.stub(_pokemonRepository, 'request');
    });

    describe('getById()', () => {
        it('it should call back request method', async () => {
            const value = 1;
            await _pokemonRepository.getRecord(value);
            expect(_pokemonRepository.request.callCount).toBe(1);
            const arg = _pokemonRepository.request.getCall(0).args[0];
            expect(arg.url).toBe(`/pokemon/${value}`);
            expect(arg.method).toBe('GET');
        });
    });
});