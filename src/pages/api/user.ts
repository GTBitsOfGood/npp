import { ObjectId } from "mongodb";
import { generateMethodRoute } from "&server/routes/RouteFactory";
import { validateAndSanitizeIdString } from "&server/utils/Validators";
import * as UserManager from "&server/mongodb/actions/UserManager";
import { SessionUser } from "&server/models/SessionUser";
import { AuthenticationError } from "&server/utils/AuthenticationError";
import { ADMIN_ROLE } from "&server/utils/Authentication";
import { MetricReporter } from "&server/utils/MetricReporter";

const METRIC_REPORTER = new MetricReporter();
const SOURCE_NAME = "User Route";
const EVENTS = {
  FETCH_USER: "FETCH_USER",
};

const handler = generateMethodRoute(
  {
    requireSession: true,
  },
  {
    get: async (req) => {
      const startTime = new Date();
      METRIC_REPORTER.reportIntervalEventInitiated(
        SOURCE_NAME,
        EVENTS.FETCH_USER,
        startTime
      );

      let outputUser;
      if (req.query.id) {
        const objectId = validateAndSanitizeIdString(req.query.id as string);
        outputUser = validateUserHasAccessToUser(
          req.user as SessionUser,
          await UserManager.getUserById(objectId)
        );
      } else if (req.query.email) {
        outputUser = validateUserHasAccessToUser(
          req.user as SessionUser,
          await UserManager.getUserByEmail(req.query.email as string)
        );
      }

      METRIC_REPORTER.reportIntervalEventCompleted(
        SOURCE_NAME,
        EVENTS.FETCH_USER,
        startTime
      );

      return outputUser;
    },
    put: async (req) => {
      const userId = validateAndSanitizeIdString(req.body.id as string);
      validateUserHasAccessToUserViaId(req.user as SessionUser, userId);
      return UserManager.updateOrganizationForUser(
        userId,
        req.body.organization,
        req.body.organizationVerified
      );
    },
    post: {
      routeHandler: async (req) => {
        const userId = validateAndSanitizeIdString(req.body.id as string);
        return UserManager.updateOrganizationVerifiedStatus(
          userId,
          req.body.organizationVerified
        );
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
