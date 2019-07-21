import { SecurityServiceException } from "./SecurityServiceException";

export class CacheMissedException extends SecurityServiceException {
  constructor(message?: string) {
    super(message);
  }
}
