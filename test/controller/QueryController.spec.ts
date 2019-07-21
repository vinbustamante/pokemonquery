import * as expect from 'expect';
import * as sinon from 'sinon';
import { QueryController } from '../../src/controller/QueryController';

describe('QueryController', () => {
    let _queryController;
    let _pokemonService;

    beforeEach(() => {
        _pokemonService = {
            getRecord: sinon.spy()
        };

        _queryController = new QueryController();
        (<any> _queryController)._pokemonService = _pokemonService;
    });

    describe('execute()', () => {
        it('should call the pokemonservice', () => {
            const queryValue = 1;
            _queryController.execute({
                queryValue: queryValue
            });
            expect(_pokemonService.getRecord.callCount).toBe(1);
            expect(_pokemonService.getRecord.getCall(0).args[0]).toBe(queryValue);
        });
    });
});