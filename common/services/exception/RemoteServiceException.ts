import { ServiceException } from './ServiceException';

export class RemoteServiceException extends ServiceException {
    constructor(message?: string) {
        super(message);
    }
}