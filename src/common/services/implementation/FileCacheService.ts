import { injectable, inject } from 'inversify';
import { IFileCacheService } from '../IFileCacheService';
import { IFileService } from '../IFileService';
import { IDateService } from '../IDateService';
import { IConfigService } from '../IConfigService';
import { IReflectionService } from '../IReflectionService';
import { types as serviceTypes } from '../types';
import { FileCacheDto } from '../dto/FileCacheDto';
import { CacheExpiredException } from '../exception/CacheExpiredException';
import { CacheMissedException } from '../exception/CacheMissedException';

@injectable()
export class FileCacheService implements IFileCacheService {

    @inject(serviceTypes.IConfigService)
    private readonly _configService: IConfigService;

    @inject(serviceTypes.IFileService)
    private readonly _fileService: IFileService;

    @inject(serviceTypes.IReflectionService)
    private readonly _reflectionService: IReflectionService;

    @inject(serviceTypes.IDateService)
    private readonly _dateService: IDateService;

    get(key: string): Promise<FileCacheDto> {
        return this._fileService.read(key)
            .then(cacheContent => {
                const cache = this._reflectionService.toObject(cacheContent);
                const expiredIn = cache.expiredIn;
                const currentTs = this._dateService.getCurrentTimestamp();

                if (currentTs > expiredIn) {
                    return Promise.reject(new CacheExpiredException());
                } else {
                    return cache.payload;
                }
            })
            .catch((err) => {
                return Promise.reject(new CacheMissedException(err.message));
            });
    }

    set(key: string, content: any): Promise<FileCacheDto> {
        const payload = {
            expiredIn: this._computeExpiration(),
            payload: content
        };
        return this._fileService.write(key, payload)
            .then(() => {
                return {
                    expiredIn: payload.expiredIn,
                    payload: content
                };
            });
    }

    private _computeExpiration() {
        const ttl = this._dateService.timespanToSeconds(this._configService.getCacheTTL());
        const ts = this._dateService.getCurrentTimestamp();
        return ts + ttl;
    }
}