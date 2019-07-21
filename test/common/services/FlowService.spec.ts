import * as expect from "expect";
import * as sinon from "sinon";
import { FlowService } from "../../../src/common/services/implementation/FlowService";

describe("FlowService", () => {
  let _flowService;
  let _asyncLib;
  let _asyncCallback;

  beforeEach(() => {
    _asyncCallback = sinon.spy();
    _asyncLib = {
      eachOfLimit: () => {}
    };
    sinon.stub(_asyncLib, "eachOfLimit");
    //@ts-ignore
    _asyncLib.eachOfLimit.callsFake((items, parallelCount, callback, done) => {
      items.forEach((item, index) => {
        callback(item, index, _asyncCallback);
      });
      done();
    });

    _flowService = new FlowService();
    (<any> _flowService)._asyncLib = _asyncLib;
  });

  describe("each()", () => {
    it("should return same number of results as input", async () => {
      const inputs = [1, 2];
      const results = await _flowService.each(inputs, item => {
        return Promise.resolve(item);
      });
      expect(inputs.length).toBe(results.length);
      expect(_asyncCallback.callCount).toBe(results.length);
    });

    it("should stop process if there was an error", testDone => {
      _asyncLib = {
        eachOfLimit: () => {}
      };
      sinon.stub(_asyncLib, "eachOfLimit");
      //@ts-ignore
      _asyncLib.eachOfLimit.callsFake(
        //@ts-ignore
        (items, parallelCount, callback, done) => {
          items.forEach((item, index) => {
            callback(item, index, _asyncCallback);
          });
          done(1);
        }
      );
      (<any>_flowService)._asyncLib = _asyncLib;

      const inputs = [1, 2];
      _flowService
        .each(inputs, item => {
          if (item === 2) {
            return Promise.reject(item);
          } else {
            return Promise.resolve(item);
          }
        })
        .catch(() => {
          testDone();
          return Promise.resolve();
        });
    });
  });
});
