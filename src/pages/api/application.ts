import { generateMethodRoute } from "&server/routes/RouteFactory";
import { SessionUser } from "&server/models/SessionUser";
import { AuthenticationError } from "&server/utils/AuthenticationError";
import {
  validateAndSanitizeIdString,
  ValidationError,
} from "&server/utils/Validators";
import * as ApplicationManager from "&server/mongodb/actions/ApplicationManager";
import * as Authentication from "&server/utils/Authentication";
import { MetricReporter } from "&server/utils/MetricReporter";

const METRIC_REPORTER = new MetricReporter();
const SOURCE_NAME = "Application Route";
const EVENTS = {
  FETCH_APPLICATION: "FETCH_APPLICATION",
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
        EVENTS.FETCH_APPLICATION,
        startTime
      );

      let returnValue: Record<string, any> | Record<string, any>[];
      if (req.query.id) {
        const applicationId = validateAndSanitizeIdString(
          req.query.id as string
        );
        returnValue = validateUserHasAccessToApplication(
          req.user as SessionUser,
          await ApplicationManager.getApplicationById(applicationId)
        );
      } else {
        returnValue = ApplicationManager.getApplications(
          req.user as SessionUser,
          req.query
        );
      }

      METRIC_REPORTER.reportIntervalEventCompleted(
        SOURCE_NAME,
        EVENTS.FETCH_APPLICATION,
        startTime
      );
      return returnValue;
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
      const application = { ...req.body.application };
      const user = req.user as SessionUser;
      application.users = [user.id];

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
        "User is trying to access an application they are not authorized to access"
      );
    }
  }
  return application;
}

export default handler;
