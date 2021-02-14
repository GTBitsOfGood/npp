import { ObjectId } from "mongodb";
import { generateMethodRoute } from "&server/routes/RouteFactory";
import { validateAndSanitizeIdString } from "&server/utils/Validators";
import * as UserManager from "&server/mongodb/actions/UserManager";
import { SessionUser } from "&server/models/SessionUser";
import { AuthenticationError } from "&server/utils/AuthenticationError";
import { ADMIN_ROLE } from "&server/utils/Authentication";

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
    put: async (req) => {
      const userId = validateAndSanitizeIdString(req.body.id as string);
      validateUserHasAccessToUserViaId(req.user as SessionUser, userId);
      return UserManager.updateOrganizationForUser(
        userId,
        req.body.organization
      );
    },
    post: {
      routeHandler: async (req) => {
        const userId = validateAndSanitizeIdString(req.body.id as string);
        validateUserHasAccessToUserViaId(req.user as SessionUser, userId);
        if (req.body.organizationVerified) {
          return UserManager.updateOrganizationVerifiedStatus(
            userId,
            req.body.organizationVerified
          );
        } else {
          return UserManager.upgradeToAdmin(userId);
        }
      },
      routeConfiguration: { requiredRoles: [ADMIN_ROLE] },
    },
  }
);

function validateUserHasAccessToUser(
  currentUser: SessionUser,
  userBeingAccessed: Record<string, any>
): Record<string, any> | null {
  if (!userBeingAccessed) {
    return null;
  }

  validateUserHasAccessToUserViaId(currentUser, userBeingAccessed._id);

  return userBeingAccessed;
}

function validateUserHasAccessToUserViaId(
  currentUser: SessionUser,
  userBeingAccessedId: ObjectId
) {
  if (!currentUser.isAdmin) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (currentUser.id != userBeingAccessedId.toString()) {
      throw new AuthenticationError(
        "User is trying to access another user they are not authorized to access"
      );
    }
  }
}

export default handler;
