import { PublicError } from "../routes/PublicError";

export class AuthenticationError extends PublicError {
  constructor(message: string) {
    super(message, 401);
  }
}
