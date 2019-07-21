import * as expect from 'expect';
import * as sinon from 'sinon';
import { HttpRepositoryBase } from '../../../src/common/repositories/implementation/HttpRepositoryBase';

describe('HttpRepositoryBase', () => {
    let _repository;
    let _configService;
    let _httpService;
    let _dbInfo;
    let _reflectionService;

    beforeEach(() => {
        _reflectionService = {
            toObject: sinon.spy()
        };

        _httpService = {
            invoke: () => { }
        };
        sinon.stub(_httpService, 'invoke');
        _httpService.invoke.callsFake(() => {
            return Promise.resolve({
                response: '{}'
            });
        });

        _dbInfo = {
            host: 'localhost',
            db: 'pokemon'
        };
        _configService = {
            getDatabaseInfo: () => { }
        };
        sinon.stub(_configService, 'getDatabaseInfo');
        _configService.getDatabaseInfo.callsFake(() => {
            return _dbInfo;
        });

        _repository = new MockRepository();
        (<any> _repository)._configService = _configService;
        (<any> _repository)._httpService = _httpService;
        (<any> _repository)._reflectionService = _reflectionService;
    });

    describe('request()', () => {
        it('should call suporting services', async () => {
            await _repository.request({
                url: 'http://sample.com'
            });
            expect(_configService.getDatabaseInfo.callCount).toBe(1);
            expect(_httpService.invoke.callCount).toBe(1);
            expect(_reflectionService.toObject.callCount).toBe(1);
        });
    });
});

class MockRepository extends HttpRepositoryBase {
}