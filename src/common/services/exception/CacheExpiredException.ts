import { SecurityServiceException } from "./SecurityServiceException";

export class CacheExpiredException extends SecurityServiceException {
  constructor(message?: string) {
    super(message);
  }
}
