import "reflect-metadata";
import * as expect from "expect";
import * as sinon from "sinon";
import { IHttpService } from "../../../src/common/services/IHttpService";
import { HttpService } from "../../../src/common/services/implementation/HttpService";
import { RemoteServiceException } from "../../../src/common/services/exception/RemoteServiceException";
import { AccessSecurityServiceException } from "../../../src/common/services/exception/AccessSecurityServiceException";
import { ServerOveraCapacityException } from "../../../src/common/services/exception/ServerOveraCapacityException";

describe("HttpService", () => {
  let _httpService: IHttpService;
  let lib;

  beforeEach(() => {
    _httpService = new HttpService();
    lib = {
      request: () => {}
    };
    sinon.stub(lib, "request");
    //@ts-ignore
    lib.request.callsFake((payload, handler) => {
      handler(null, { statusCode: "200" }, "");
    });
    (<any>_httpService)._requestLib = lib.request;
  });

  describe("get()", () => {
    it("should call the invoke passing correct parameter", async () => {
      const api = "http://sample.com";
      await _httpService.get({ url: api });
      expect(lib.request.callCount).toBe(1);
      const request = lib.request.getCall(0).args[0];
      expect(request.url).toBe(api);
      expect(request.method).toBe("GET");
      expect(request.json).toBe(true);
      expect(request.body).toBe(undefined);
    });
  });

  describe("post()", () => {
    it("should call the invoke passing correct parameter", async () => {
      const api = "http://sample.com";
      const data = {
        name: "marvin"
      };
      await _httpService.post({ url: api, data: data });
      expect(lib.request.callCount).toBe(1);
      const request = lib.request.getCall(0).args[0];
      expect(request.url).toBe(api);
      expect(request.method).toBe("POST");
      expect(request.json).toBe(true);
      expect(request.body).toBe(data);
    });
  });

  describe("invoke()", () => {
    it("should default to post method if not provided", async () => {
      const api = "http://sample.com";
      const data = {
        name: "marvin"
      };
      await _httpService.invoke({ url: api, data: data });
      const request = lib.request.getCall(0).args[0];
      expect(lib.request.callCount).toBe(1);
      expect(request.url).toBe(api);
      expect(request.method).toBe("POST");
      expect(request.json).toBe(true);
    });

    it("should provide default body if not provided", async () => {
      const api = "http://sample.com";
      await _httpService.invoke({ url: api });
      const request = lib.request.getCall(0).args[0];
      expect(lib.request.callCount).toBe(1);
      expect(request.url).toBe(api);
      expect(request.method).toBe("POST");
      expect(request.json).toBe(true);
    });

    it("should throw RemoteServiceException if there was an error contacting the server", done => {
      lib = {
        request: () => {}
      };
      sinon.stub(lib, "request");
      //@ts-ignore
      lib.request.callsFake((payload, handler) => {
        handler({ message: "hello world" }, { statusCode: "200" }, "");
      });
      (<any>_httpService)._requestLib = lib.request;
      const api = "http://sample.com";
      _httpService.invoke({ url: api }).catch(err => {
        expect(err instanceof RemoteServiceException).toBe(true);
        done();
      });
    });

    it("should throw AccessSecurityServiceException if status 401", done => {
      lib = {
        request: () => {}
      };
      sinon.stub(lib, "request");
      //@ts-ignore
      lib.request.callsFake((payload, handler) => {
        handler(null, { statusCode: "401" }, "");
      });
      (<any>_httpService)._requestLib = lib.request;
      const api = "http://sample.com";
      _httpService.invoke({ url: api }).catch(err => {
        expect(err instanceof AccessSecurityServiceException).toBe(true);
        done();
      });
    });

    it("should throw ServerOveraCapacityException if status 503", done => {
      lib = {
        request: () => {}
      };
      sinon.stub(lib, "request");
      //@ts-ignore
      lib.request.callsFake((payload, handler) => {
        handler(null, { statusCode: "503" }, "");
      });
      (<any>_httpService)._requestLib = lib.request;
      const api = "http://sample.com";
      _httpService.invoke({ url: api }).catch(err => {
        expect(err instanceof ServerOveraCapacityException).toBe(true);
        done();
      });
    });

    it("should throw RemoteServiceException for any status code other than 200", done => {
      lib = {
        request: () => {}
      };
      sinon.stub(lib, "request");
      //@ts-ignore
      lib.request.callsFake((payload, handler) => {
        handler(null, { statusCode: "500" }, "");
      });
      (<any>_httpService)._requestLib = lib.request;
      const api = "http://sample.com";
      _httpService.invoke({ url: api }).catch(err => {
        expect(err instanceof RemoteServiceException).toBe(true);
        done();
      });
    });
  });
});
