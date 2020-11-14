import { generateMethodRoute } from "&server/routes/RouteFactory";
import { validateAndSanitizeIdString } from "&server/utils/Validators";
import * as UserManager from "&server/mongodb/actions/UserManager";
import { SessionUser } from "&server/models/SessionUser";
import { AuthenticationError } from "&server/utils/AuthenticationError";

const handler = generateMethodRoute(
  {
    requireSession: true,
  },
  {
    get: async (req) => {
      if (req.query.id) {
        const objectId = validateAndSanitizeIdString(req.query.id as string);
        return validateUserHasAccessToUser(
          req.user as SessionUser,
          await UserManager.getUserById(objectId)
        );
      } else if (req.query.email) {
        return validateUserHasAccessToUser(
          req.user as SessionUser,
          await UserManager.getUserByEmail(req.query.email as string)
        );
      }
    },
  }
);

async function validateUserHasAccessToUser(
  currentUser: SessionUser,
  userBeingAccessed: Record<string, any> | null
): Promise<Record<string, any> | null> {
  if (!userBeingAccessed) {
    return null;
  }

  if (!currentUser.isAdmin) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (currentUser.id != userBeingAccessed._id) {
      throw new AuthenticationError(
        "User is trying to access another user they are not authorized to access"
      );
    }
  }
  return userBeingAccessed;
}
export default handler;
