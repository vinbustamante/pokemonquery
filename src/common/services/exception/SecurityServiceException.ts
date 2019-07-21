import { ServiceException } from "./ServiceException";

export class SecurityServiceException extends ServiceException {
  constructor(message?: string) {
    super(message);
  }
}
