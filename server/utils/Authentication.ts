import { NextApiRequest } from "next";
import { getSession } from "next-auth/client";
import { SessionUser } from "../models/SessionUser";
import { AuthenticationError } from "./AuthenticationError";

/**
 * Get's user from request. You should not have to call this method if you are using
 * a wrapped Route
 * @param req
 */
export async function getUser(
  req: NextApiRequest
): Promise<SessionUser | null> {
  const session = await getSession({ req });
  if (!session) {
    return null;
  }
  return session.user as SessionUser;
}

/**
 * Ensures user has the required roles.  Otherwise, throw an authentication error
 * @param user - the user to be authentication
 * @param requiredRoles
 */
export async function authenticate(
  user: SessionUser | null,
  requiredRoles: string[] | null | undefined
): Promise<void> {
  if (!user) {
    throw new AuthenticationError(
      "User session not found. Ensure you are logged in."
    );
  }

  const userRoles = new Set(user.roles);
  let missingRole;
  if (
    requiredRoles &&
    (missingRole = requiredRoles.find((val) => !userRoles.has(val)))
  ) {
    throw new AuthenticationError(
      `Missing at least one required role: ${missingRole}`
    );
  }
}

/**
 * Ensure the user is admin. Otherwise, throw an authentication error
 * @param user - the user
 */
export function ensureAdmin(user: SessionUser | null | undefined): void {
  if (!user || !user.isAdmin) {
    throw new AuthenticationError("User must be an admin to access this route");
  }
}

export const ADMIN_ROLE = "NPP-Admin";
