import { ServiceException } from './ServiceException';

export class ServerOveraCapacityException extends ServiceException {
    constructor(message?: string) {
        super(message);
    }
}