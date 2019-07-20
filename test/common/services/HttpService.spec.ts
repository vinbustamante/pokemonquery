import 'reflect-metadata';
const expect = require('expect');
import * as sinon from 'sinon';
import { IHttpService } from '../../../common/services/IHttpService';
import { HttpService } from '../../../common/services/implementation/HttpService';

describe('HttpService', () => {
    let _httpService: IHttpService;

    beforeEach(() => {
        _httpService = new HttpService();
    });

    describe('get()', () => {
        it('should call the invoke passing correct parameter', async () => {
            const lib: any = {
                request: () => { }
            };
            sinon.stub(lib, 'request');
            //@ts-ignore
            lib.request.callsFake((payload, handler) => {
                handler(null, {statusCode: '200'}, '');
            });
            (<any>_httpService)._requestLib = lib.request;
            const api = 'http://sample.com';
            await _httpService.get({ url: api });
            expect(lib.request.callCount).toBe(1);
            const request = lib.request.getCall(0).args[0];
            expect(request.url).toBe(api);
            expect(request.method).toBe('GET');
            expect(request.json).toBe(true);
            expect(request.body).toBe(undefined);
        });
    });
});