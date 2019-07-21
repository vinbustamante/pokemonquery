import "reflect-metadata";
import * as expect from "expect";
import * as sinon from 'sinon';
import { FileCacheService } from "../../../src/common/services/implementation/FileCacheService";
import { CacheExpiredException } from "../../../src/common/services/exception/CacheExpiredException";
import { CacheMissedException } from "../../../src/common/services/exception/CacheMissedException";

describe('FileCacheService', () => {
    let _fileCacheService;
    let _fileService;
    let _reflectionService;
    let _dateService;
    let _configService;

    beforeEach(() => {
        _configService = {
            getCacheTTL: () => { }
        };
        sinon.stub(_configService, 'getCacheTTL');
        _configService.getCacheTTL.callsFake(() => {
            return '1d';
        });

        _fileService = {
            read: () => { },
            write: () => { }
        };
        sinon.stub(_fileService, 'read');
        _fileService.read.callsFake(() => {
            return Promise.resolve('{"expiredIn":0}');
        });
        sinon.stub(_fileService, 'write');
        _fileService.write.callsFake(() => {
            return Promise.resolve();
        });

        _reflectionService = {
            toObject: () => { }
        };
        sinon.stub(_reflectionService, 'toObject');
        _reflectionService.toObject.callsFake(() => {
            return {
                expiredIn: 0,
                payload: {
                    name: 'marvin'
                }
            };
        });

        _dateService = {
            getCurrentTimestamp: () => { },
            timespanToSeconds: () => { }
        };
        sinon.stub(_dateService, 'getCurrentTimestamp');
        _dateService.getCurrentTimestamp.callsFake(() => {
            return 100;
        });
        sinon.stub(_dateService, 'timespanToSeconds');
        _dateService.timespanToSeconds.callsFake(() => {
            return 100;
        });

        _fileCacheService = new FileCacheService();
        (<any> _fileCacheService)._reflectionService = _reflectionService;
        (<any> _fileCacheService)._fileService = _fileService;
        (<any> _fileCacheService)._dateService = _dateService;
        (<any> _fileCacheService)._configService = _configService;
    });

    describe('get()', () => {
        it('should return payload property if the cache is found', async () => {
            _reflectionService = {
                toObject: () => { }
            };
            sinon.stub(_reflectionService, 'toObject');
            _reflectionService.toObject.callsFake(() => {
                return {
                    expiredIn: 200,
                    payload: {
                        name: 'marvin'
                    }
                };
            });
            (<any> _fileCacheService)._reflectionService = _reflectionService;
            const fileName = 'sample.json';
            const pokemon = await _fileCacheService.get(fileName);
            expect(_fileService.read.getCall(0).args[0]).toBe(fileName);
            expect(pokemon.name).toBe('marvin');
        });

        it('should throw CacheExpiredException if cache is expired', (done) => {
            const fileName = 'sample.json';
            _fileCacheService.get(fileName)
                .catch(err => {
                    expect(_fileService.read.getCall(0).args[0]).toBe(fileName);
                    expect(err instanceof CacheExpiredException).toBe(true);
                    done();
                });
        });

        it('should throw CacheMissedException if error reading file', (done) => {
            _fileService = {
                read: () => { }
            };
            sinon.stub(_fileService, 'read');
            _fileService.read.callsFake(() => {
                return Promise.reject('error');
            });
            (<any> _fileCacheService)._fileService = _fileService;

            const fileName = 'sample.json';
            _fileCacheService.get(fileName)
                .catch(err => {
                    expect(_fileService.read.getCall(0).args[0]).toBe(fileName);
                    expect(err instanceof CacheMissedException).toBe(true);
                    done();
                });
        });
    });

    describe('set()', () => {
        it('should call the supporting services', async () => {
            const filename = 'sample.json';
            const payload = {
                name: 'marvin'
            };
            await _fileCacheService.set(filename, payload);
            expect(_configService.getCacheTTL.callCount).toBe(1);
            expect(_dateService.getCurrentTimestamp.callCount).toBe(1);
            expect(_fileService.write.callCount).toBe(1);
            const args = _fileService.write.getCall(0).args;
            expect(args[0]).toBe(filename);
            expect(args[1].expiredIn > 0).toBe(true);
            expect(args[1].payload).toBe(payload);
        });
    });
});