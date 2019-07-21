import "reflect-metadata";
import * as sinon from 'sinon';
import * as expect from 'expect';
import { IDateService } from "../../../src/common/services/IDateService";
import { DateService } from "../../../src/common/services/implementation/DateService";

describe("DateService", () => {
  let _dateService: IDateService;
  let _dateLib;
  let _dateFunction;

  beforeEach(() => {
    _dateFunction =  {
      unix: sinon.spy()
    };
    _dateLib = () => {
      return _dateFunction;
    };
    _dateService = new DateService();
    (<any> _dateService)._dateLib = _dateLib;
  });

  describe("timespanToSeconds()", () => {
    it('should return 0 if the time stamp ins not supported', () => {
      expect(_dateService.timespanToSeconds('60x')).toBe(0);
    });

    it("should support seconds", () => {
      expect(_dateService.timespanToSeconds('60s')).toBe(60);
    });

    it('should support minute', () => {
      expect(_dateService.timespanToSeconds('1m')).toBe(60);
    });

    it('should support hour', () => {
      expect(_dateService.timespanToSeconds('1h')).toBe(3600);
    });

    it('should support day', () => {
      expect(_dateService.timespanToSeconds('1d')).toBe(86400);
    });
  });

  describe('getCurrentTimestamp', () => {
    it('should call the datelib unix function', () => {
      _dateService.getCurrentTimestamp();
      expect(_dateFunction.unix.callCount).toBe(1);
    });
  });
});
