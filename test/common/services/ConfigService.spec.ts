import "reflect-metadata";
import * as expect from "expect";
import { ConfigService } from "../../../src/common/services/implementation/ConfigService";

describe("ConfigService", () => {
  let _configService;
  let _config;

  beforeEach(() => {
    _config = {
      database: {
        host: "localhost",
        db: "pokemon"
      },
      filter: {
        locations: ["kanto"]
      },
      cache: {
        ttl: "1d"
      }
    };
    _configService = new ConfigService(_config);
  });

  describe("getDatabaseInfo()", () => {
    it("should read config from database", () => {
      const dbInfo = _configService.getDatabaseInfo();
      expect(dbInfo.host).toBe(_config.database.host);
      expect(dbInfo.db).toBe(_config.database.db);
    });
  });

  describe("getLocationFilters()", () => {
    it("should read config location", () => {
      const locationFilter = _configService.getLocationFilters();
      expect(locationFilter).toBe(_config.filter.locations);
    });
  });

  describe("getCacheTTL()", () => {
    it("should read cache config", () => {
      const ttl = _configService.getCacheTTL();
      expect(ttl).toBe(_config.cache.ttl);
    });

    it("should return default 1d if no config is found", () => {
      _config.cache.ttl = undefined;
      const ttl = _configService.getCacheTTL();
      expect(ttl).toBe("1d");
    });
  });
});
