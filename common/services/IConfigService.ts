import { DatabaseDto } from './dto/DatabaseDto';

export interface IConfigService {
    getDatabaseInfo(): DatabaseDto;
}