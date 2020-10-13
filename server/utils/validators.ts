import { NextApiResponse } from "next";
import { ObjectId } from "mongodb";

/**
 * Sanitize a mongoose id string to an object id. Returns a 400 if not valid
 * @param id - the id string to sanitize
 * @param res - the current request's response object
 */
export function validateAndSanitizeIdString(
  id: string,
  res: NextApiResponse
): ObjectId {
  try {
    return new ObjectId(id);
  } catch (error) {
    res.status(400).json({
      message: `${id} is not a valid ObjectID`,
      error: error,
    });
    // will never be reached
    return new ObjectId();
  }
}
