import { NextApiRequest } from "next";
import { SessionUser } from "../models/SessionUser";

export interface NppApiRequest extends NextApiRequest {
  user: SessionUser | undefined | null;
  startTime: Date;
  endTime: Date | undefined | null;
}
