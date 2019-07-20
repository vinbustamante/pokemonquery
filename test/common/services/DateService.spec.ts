import "reflect-metadata";
//@ts-ignore
const expect = require("expect");
import IDateService from "../../../src/common/services/IDateService";
import DateService from "../../../src/common/services/implementation/DateService";

describe("DateService", () => {
  //@ts-ignore
  let _dateService: IDateService;

  beforeEach(() => {
    _dateService = new DateService();
  });

  describe("getCurrentUnixTimestamp", () => {
    it("should return number", () => {
      // expect(typeof _dateService.getCurrentUnixTimestamp() === 'number').toBe(true);
    });
  });
});
