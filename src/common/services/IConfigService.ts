import { DatabaseDto } from './dto/DatabaseDto';

export interface IConfigService {
    getDatabaseInfo(): DatabaseDto;
    getLocationFilters(): string[];
    getCacheTTL(): string;
}