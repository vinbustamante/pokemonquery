import { injectable, inject } from 'inversify';
import { RepositoryBase } from './RepositoryBase';
import { IHttpService, IHttpServiceRequest } from '../../services/IHttpService';
import { IConfigService } from '../../services/IConfigService';
import { types as commonServiceTypes } from '../../services/types';

@injectable()
export abstract class HttpRepositoryBase extends RepositoryBase {

    @inject(commonServiceTypes.IConfigService)
    protected readonly _configService: IConfigService;

    @inject(commonServiceTypes.IHttpService)
    protected readonly _httpService: IHttpService;

    request(request: IHttpServiceRequest): Promise<any> {
        const databaseInfo = this._configService.getDatabaseInfo();
        const payload = {...request, url: databaseInfo.host + request.url };
        const self = this;
        return this._httpService.invoke(payload)
            .then(response => {
                return self._reflectionService.toJson(response.response);
            });
    }
}