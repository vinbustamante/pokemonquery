import { SecurityServiceException } from "./SecurityServiceException";

export class AccessSecurityServiceException extends SecurityServiceException {
  constructor(message?: string) {
    super(message);
  }
}
