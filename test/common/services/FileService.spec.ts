import * as sinon from "sinon";
import * as expect from "expect";
import { FileService } from "../../../src/common/services/implementation/FileService";
import { FileAccessException } from "../../../src/common/services/exception/FileAccessException";

describe("FileService", () => {
  let _fileService;
  let _reflectionService;
  let _fileLib;
  let _bufferLib;
  let _fileContent;

  beforeEach(() => {
    _fileContent = "{}";
    _reflectionService = {
      toJson: () => {}
    };
    sinon.stub(_reflectionService, "toJson");
    _reflectionService.toJson.callsFake(() => {
      return _fileContent;
    });

    _bufferLib = {
      toString: sinon.spy()
    };

    _fileLib = {
      readFile: () => {},
      writeFile: () => {}
    };
    sinon.stub(_fileLib, "readFile");
    sinon.stub(_fileLib, "writeFile");
    //@ts-ignore
    _fileLib.readFile.callsFake((file, handler) => {
      handler(null, _bufferLib);
    });
    //@ts-ignore
    _fileLib.writeFile.callsFake((file, contentString, handler) => {
      handler(null);
    });

    _fileService = new FileService();
    (<any>_fileService)._fileLib = _fileLib;
    (<any>_fileService)._reflectionService = _reflectionService;
  });

  describe("read()", () => {
    it("should convert the buffer to string", async () => {
      const fileName = "sample.json";
      await _fileService.read(fileName);
      expect(_fileLib.readFile.callCount).toBe(1);
      expect(_fileLib.readFile.getCall(0).args[0]).toBe(fileName);
      expect(_bufferLib.toString.callCount).toBe(1);
    });

    it("should throw FileAccessException for if error encounter", done => {
      _fileLib = {
        readFile: () => {}
      };
      sinon.stub(_fileLib, "readFile");
      //@ts-ignore
      _fileLib.readFile.callsFake((file, handler) => {
        handler({ message: "error" });
      });
      (<any>_fileService)._fileLib = _fileLib;
      const fileName = "sample.json";
      _fileService.read(fileName).catch(err => {
        expect(err instanceof FileAccessException).toBe(true);
        done();
      });
    });
  });

  describe("write()", () => {
    it("should call supporting services", async () => {
      const fileName = "sample.json";
      const payload = {};
      const writeContent = await _fileService.write(fileName, payload);
      expect(_reflectionService.toJson.callCount).toBe(1);
      expect(_reflectionService.toJson.getCall(0).args[0]).toBe(payload);
      expect(_fileLib.writeFile.callCount).toBe(1);
      const writeFileArgs = _fileLib.writeFile.getCall(0).args;
      expect(writeFileArgs[0]).toBe(fileName);
      expect(writeFileArgs[1]).toBe(_fileContent);
      expect(writeContent).toBe(_fileContent);
    });

    it("should throw FileAccessException if there was an error", done => {
      _fileLib = {
        writeFile: () => {}
      };
      sinon.stub(_fileLib, "writeFile");
      //@ts-ignore
      _fileLib.writeFile.callsFake((file, contentString, handler) => {
        handler({ message: "error" });
      });
      (<any>_fileService)._fileLib = _fileLib;

      const fileName = "sample.json";
      const payload = {};
      _fileService.write(fileName, payload).catch(err => {
        expect(err instanceof FileAccessException).toBe(true);
        done();
      });
    });
  });
});
