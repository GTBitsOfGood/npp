import { PublicError } from "./PublicError";

export class AuthenticationError extends PublicError {
  constructor(message: string) {
    super(message, 401);
  }
}
