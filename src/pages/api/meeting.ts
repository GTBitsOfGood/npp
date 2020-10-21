import { generateMethodRoute } from "../../../server/utils/RouteUtils";
import { validateAndSanitizeIdString } from "../../../server/utils/Validators";
import { PublicError } from "../../../server/utils/PublicError";
import MeetingManager from "../../../server/mongodb/actions/MeetingManager";
import { SessionUser } from "../../../server/models/SessionUser";
import Authentication from "../../../server/utils/Authentication";
import ApplicationManager from "../../../server/mongodb/actions/ApplicationManager";
import { AuthenticationError } from "../../../server/utils/AuthenticationError";

const handler = generateMethodRoute(
  {
    requireSession: true,
  },
  {
    get: async (req, res) => {
      const user = req.user as SessionUser;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (req.query.id) {
        const objectId = validateAndSanitizeIdString(req.query.id as string);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return validateUserHasAccessToMeeting(
          user,
          MeetingManager.getMeetingById(objectId)
        );
      } else if (req.query.applicationId) {
        const objectId = validateAndSanitizeIdString(
          req.query.applicationId as string
        );
        return validateUserHasAccessToMeeting(
          user,
          await MeetingManager.getMeetingByApplicationId(objectId)
        );
      } else {
        Authentication.ensureAdmin(user);
        return MeetingManager.getMeetings();
      }
    },
    put: async (req, res) => {
      const meeting = req.body.meeting;
      await validateUserHasAccessToMeeting(req.user as SessionUser, meeting);
      const result = await MeetingManager.addMeeting(meeting);

      if (!result) {
        throw new PublicError("Failed to insert document", 500);
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    },
  }
);

async function validateUserHasAccessToMeeting(
  user: SessionUser,
  meeting: Record<string, any>
) {
  if (!user.isAdmin) {
    const application = await ApplicationManager.getApplicationById(
      meeting.application
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!application.owners.includes(user.id)) {
      throw new AuthenticationError(
        "User is trying to access a meeting they are not authorized to access"
      );
    }
  }
  return meeting;
}

export default handler;
