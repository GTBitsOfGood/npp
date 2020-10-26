import { ObjectId } from "mongodb";
import { PublicError } from "../routes/PublicError";

export class ValidationError extends PublicError {
  constructor(message: string) {
    super(message, 400);
  }
}

/**
 * Sanitize a mongoose id string to an object id. Returns a 400 if not valid
 * @param id - the id string to sanitize
 * @param res - the current request's response object
 */
export function validateAndSanitizeIdString(id: string): ObjectId {
  try {
    if (id) {
      return new ObjectId(id);
    }
  } catch (error) {
    // do nothing
  }
  throw new ValidationError(`${id} is not a valid ObjectID`);
}
