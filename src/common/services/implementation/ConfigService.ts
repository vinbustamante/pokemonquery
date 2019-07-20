import { injectable } from 'inversify';
import { IConfigService } from '../IConfigService';
import { DatabaseDto } from '../dto/DatabaseDto';

@injectable()
export class ConfigService implements IConfigService {

    private readonly _config: any;

    constructor(config) {
        this._config = config;
    }

    getDatabaseInfo(): DatabaseDto {
        return {
            host: this._config.database.host,
            db: 'pokemon'
        };
    }

    getLocationFilters(): string[] {
        return this._config.filter.locations;
    }

    getCacheTTL(): string {
        return this._config.cache.ttl || '1d';
    }
}