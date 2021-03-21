import { Types } from "mongoose";

export function toObjectId(id: string): Types.ObjectId {
  return Types.ObjectId(id);
}
