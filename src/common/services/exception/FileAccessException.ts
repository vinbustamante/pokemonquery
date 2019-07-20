import { ServiceException } from './ServiceException';

export class FileAccessException extends ServiceException {
    constructor(message?: string) {
        super(message);
    }
}