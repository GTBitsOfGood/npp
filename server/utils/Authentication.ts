import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import { SessionUser } from "../models/SessionUser";
import { AuthenticationError } from "./AuthenticationError";

async function getUser(req: NextApiRequest): Promise<SessionUser | null> {
  const session = await getSession({ req });
  if (!session) {
    return null;
  }
  return session.user as SessionUser;
}

async function authenticate(
  user: SessionUser | null,
  requiredRoles: string[] | null | undefined
): Promise<void> {
  if (!user) {
    throw new AuthenticationError("Session not found");
  }
  const userRoles = new Set(user.roles);
  if (requiredRoles && requiredRoles.some((val) => !(val in userRoles))) {
    throw new AuthenticationError("Missing the required roles");
  }
}

function ensureAdmin(user: SessionUser | null | undefined) {
  if (!user || !user.isAdmin) {
    throw new AuthenticationError("User must be an admin to access this route");
  }
}

export default {
  adminRole: "NPP-Admin",
  getUser,
  authenticate,
  ensureAdmin,
};
