import { generateMethodRoute } from "&server/routes/RouteFactory";
import { SessionUser } from "&server/models/SessionUser";
import { AuthenticationError } from "&server/utils/AuthenticationError";
import {
  validateAndSanitizeIdString,
  ValidationError,
} from "&server/utils/Validators";
import ApplicationManager from "&server/mongodb/actions/ApplicationManager";
import Authentication from "&server/utils/Authentication";

const handler = generateMethodRoute(
  {
    requireSession: true,
  },
  {
    get: async (req) => {
      if (req.query.id) {
        const applicationId = validateAndSanitizeIdString(
          req.query.id as string
        );
        return validateUserHasAccessToApplication(
          req.user as SessionUser,
          await ApplicationManager.getApplicationById(applicationId)
        );
      } else {
        Authentication.ensureAdmin(req.user);
        return ApplicationManager.getApplications();
      }
    },
    delete: {
      routeHandler: async (req) => {
        const applicationId = validateAndSanitizeIdString(
          req.query.id as string
        );
        return await ApplicationManager.deleteApplication(applicationId);
      },
      routeConfiguration: {
        requiredRoles: [Authentication.ADMIN_ROLE],
      },
    },
    put: async (req) => {
      const application = req.body.application;
      await validateUserHasAccessToApplication(
        req.user as SessionUser,
        application
      );
      return ApplicationManager.addApplication(application);
    },
    post: async (req) => {
      const applicationId = validateAndSanitizeIdString(req.body.id as string);
      if (req.body.decision != null) {
        Authentication.ensureAdmin(req.user);
        return ApplicationManager.updateApplicationDecision(
          applicationId,
          req.body.applicationDecision as boolean
        );
      } else if (req.body.meetingId) {
        await validateUserHasAccessToApplication(
          req.user as SessionUser,
          await ApplicationManager.getApplicationById(applicationId)
        );
        return ApplicationManager.updateApplicationMeeting(
          applicationId,
          req.body.meetingId
        );
      } else {
        throw new ValidationError(
          "The request was not valid because it did not contain any valid update parameters in the body."
        );
      }
    },
  }
);

async function validateUserHasAccessToApplication(
  user: SessionUser,
  application: Record<string, any> | null
): Promise<Record<string, any> | null> {
  if (!application) {
    return null;
  }

  if (!user.isAdmin) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!application.users.includes(user.id)) {
      throw new AuthenticationError(
        "User is trying to access a meeting they are not authorized to access"
      );
    }
  }
  return application;
}
export default handler;