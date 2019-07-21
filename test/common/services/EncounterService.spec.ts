import * as sinon from 'sinon';
import * as expect from 'expect';
import { EncounterService } from '../../../src/common/services/implementation/EncounterService';

describe('EncounterService', () => {
    let _encounterService;
    let _encounterRepository;
    let _locationAreaRepository;
    let _configService;
    let _reflectionService;
    let _flowService;

    beforeEach(() => {
        _reflectionService = {
            isArray: () => { },
            isObject: () => { }
        };
        sinon.stub(_reflectionService, 'isArray');
        _reflectionService.isArray.callsFake(() => {
            return true;
        });

        sinon.stub(_reflectionService, 'isObject');
        _reflectionService.isObject.callsFake(() => {
            return true;
        });

        _configService = {
            getLocationFilters: () => { }
        };
        sinon.stub(_configService, 'getLocationFilters');
        _configService.getLocationFilters.callsFake(() => {
            return ['kanto'];
        });

        _encounterRepository = {
            getById: () => { }
        };
        sinon.stub(_encounterRepository, 'getById');
        _encounterRepository.getById.callsFake(() => {
            return Promise.resolve([{
                location_area: {
                    name: 'kanto-1',
                    url: 'http://sample.com/1/'
                }
            }]);
        });

        _locationAreaRepository = {
            getById: () => { }
        };
        sinon.stub(_locationAreaRepository, 'getById');
        _locationAreaRepository.getById.callsFake(() => {
            return Promise.resolve({
                encounter_method_rates: [
                    {
                        encounter_method: 'walk'
                    },
                    {
                        encounter_method: 'walk'
                    },
                    {
                        encounter_method: 'running'
                    }
                ]
            });
        });

        _flowService = {
            each: () => { }
        };
        sinon.stub(_flowService, 'each');
        _flowService.each.callsFake((items, itemHandler) => {
            items.forEach(item => {
                itemHandler(item);
            });
            return Promise.resolve();
        });

        _encounterService = new EncounterService();
        (<any> _encounterService)._encounterRepository = _encounterRepository;
        (<any> _encounterService)._locationAreaRepository = _locationAreaRepository;
        (<any> _encounterService)._configService = _configService;
        (<any> _encounterService)._reflectionService = _reflectionService;
        (<any> _encounterService)._flowService = _flowService;
    });

    describe('getById()', () => {
        it('should call suporting services to resolve the information', async() => {
            const id = 1;
            await _encounterService.getById(id);
            expect(_encounterRepository.getById.callCount).toBe(1);
            expect(_flowService.each.callCount).toBe(1);
            expect(_locationAreaRepository.getById.callCount).toBe(1);
            expect(_locationAreaRepository.getById.getCall(0).args[0]).toBe('1');
        });
    });
});