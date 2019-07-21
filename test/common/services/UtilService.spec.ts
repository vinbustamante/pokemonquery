import * as expect from "expect";
import * as sinon from "sinon";
import { UtilService } from "../../../src/common/services/implementation/UtilService";
import { types as controllerTypes } from "../../../src/controller/types";

describe("UtilService", () => {
  let _utilService;
  let _container;

  beforeEach(() => {
    _container = {
      get: () => {}
    };
    sinon.stub(_container, "get");
    _container.get.callsFake(() => {
      return [DeleteController, QueryController];
    });

    _utilService = new UtilService();
    (<any>_utilService)._container = _container;
  });

  describe("getControllerByCommand", () => {
    it("should call the container services passing the receive command string", () => {
      const cmd = "query";
      _utilService.getControllerByCommand(cmd);
      expect(_container.get.callCount).toBe(2);
      expect(_container.get.getCall(0).args[0]).toBe(controllerTypes.Commands);
      expect(_container.get.getCall(1).args[0]).toBe(QueryController);
    });
  });
});

function QueryController() {}

function DeleteController() {}

QueryController.__command__ = [
  {
    cmd: "query"
  }
];
