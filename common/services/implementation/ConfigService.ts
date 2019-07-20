import { injectable } from 'inversify';
import { IConfigService } from '../IConfigService';
import { DatabaseDto } from '../dto/DatabaseDto';

@injectable()
export class ConfigService implements IConfigService {
    getDatabaseInfo(): DatabaseDto {
        return {
            host: 'https://pokeapi.co/api/v2',
            db: 'pokemon'
        };
    }

    getLocationFilters(): string[] {
        return ['kanto'];
    }
}