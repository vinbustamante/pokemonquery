import "reflect-metadata";
import * as expect from 'expect';
import * as sinon from 'sinon';
import { PokemonCacheableService } from '../../../../src/common/services/implementation/cacheable/PokemonCacheableService';
import { CacheMissedException } from '../../../../src/common/services/exception/CacheMissedException';
import { CacheExpiredException } from '../../../../src/common/services/exception/CacheExpiredException';

describe('PokemonCacheableService', () => {
    let _fileCacheService;
    let _pokemonCacheableService;
    let _shell;
    let _pokemonRepository;
    let _encounterService;
    let _reflectionService;

    beforeEach(() => {
        _reflectionService = {
            isArray: () => { }
        };
        sinon.stub(_reflectionService, 'isArray');
        _reflectionService.isArray.callsFake(() => {
            return true;
        });

        _encounterService = {
            getById: () => { }
        };
        sinon.stub(_encounterService, 'getById');
        _encounterService.getById.callsFake(() => {
            return Promise.resolve([]);
        });

        _pokemonRepository = {
            getRecord: () => {}
        };
        sinon.stub(_pokemonRepository, 'getRecord');
        _pokemonRepository.getRecord.callsFake(() => {
            return Promise.resolve({
                id: 1,
                name: 'pikachu',
                types: [{
                    type: {
                        name: 'electric'
                    }
                }],
                stats: [{
                    stat: {
                        name: 'stat 1',
                        base_stat: 0,
                        effort: 1
                    }
                }]
            });
        });

        _shell = {
            exec: sinon.spy()
        };

        _fileCacheService = {
            get: () => { },
            set: () => { }
        };
        sinon.stub(_fileCacheService, 'get');
        _fileCacheService.get.callsFake(() => {
            return Promise.resolve({});
        });

        sinon.stub(_fileCacheService, 'set');
        _fileCacheService.set.callsFake(() => {
            return Promise.resolve({});
        });

        _pokemonCacheableService = new PokemonCacheableService();
        (<any> _pokemonCacheableService)._fileCacheService = _fileCacheService;
        (<any> _pokemonCacheableService)._shell = _shell;
        (<any> _pokemonCacheableService)._pokemonRepository = _pokemonRepository;
        (<any> _pokemonCacheableService)._encounterService = _encounterService;
        (<any> _pokemonCacheableService)._reflectionService = _reflectionService;
    });

    describe('getRecord()', () => {
        it('should check the cache before calling the parent service', async () => {
            const id = 1;
            await _pokemonCacheableService.getRecord(id);
            expect(_fileCacheService.get.callCount).toBe(1);
        });

        it('should support id as parameter', async () => {
            _fileCacheService = {
                get: () => { },
                set: () => { }
            };
            sinon.stub(_fileCacheService, 'get');
            _fileCacheService.get.callsFake(() => {
                return Promise.reject(new CacheMissedException());
            });
            sinon.stub(_fileCacheService, 'set');
            _fileCacheService.set.callsFake(() => {
                return Promise.resolve();
            });
            (<any> _pokemonCacheableService)._fileCacheService = _fileCacheService;

            const id = 1;
            await _pokemonCacheableService.getRecord(id);
            expect(_fileCacheService.get.callCount).toBe(1);
            expect(_fileCacheService.get.getCall(0).args[0].indexOf(`${id}.json`) >= 0).toBe(true);
            expect(_fileCacheService.set.callCount).toBe(1);
            expect(_pokemonRepository.getRecord.callCount).toBe(1);
            expect(_encounterService.getById.callCount).toBe(1);
        });

        it('should support name as parameter', async () => {
            _fileCacheService = {
                get: () => { },
                set: () => { }
            };
            sinon.stub(_fileCacheService, 'get');
            _fileCacheService.get.callsFake(() => {
                return Promise.reject(new CacheExpiredException());
            });
            sinon.stub(_fileCacheService, 'set');
            _fileCacheService.set.callsFake(() => {
                return Promise.resolve();
            });

            (<any> _pokemonCacheableService)._fileCacheService = _fileCacheService;

            const id = 'pikachu';
            await _pokemonCacheableService.getRecord(id);
            expect(_fileCacheService.get.callCount).toBe(1);
            expect(_fileCacheService.get.getCall(0).args[0].indexOf(`${id}.json`) >= 0).toBe(true);
            expect(_fileCacheService.set.callCount).toBe(1);
            expect(_pokemonRepository.getRecord.callCount).toBe(1);
            expect(_encounterService.getById.callCount).toBe(1);
        });

        it('should throw original error from cache service', (done) => {
            _fileCacheService = {
                get: () => { },
                set: () => { }
            };
            sinon.stub(_fileCacheService, 'get');
            _fileCacheService.get.callsFake(() => {
                return Promise.reject('hello world');
            });
            sinon.stub(_fileCacheService, 'set');
            _fileCacheService.set.callsFake(() => {
                return Promise.resolve();
            });
            (<any> _pokemonCacheableService)._fileCacheService = _fileCacheService;

            const id = 'pikachu';
            _pokemonCacheableService.getRecord(id)
                .catch(err => {
                    expect(err).toBe('hello world');
                    done();
                });
        });
    });
});
