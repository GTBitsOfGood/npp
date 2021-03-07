import { PublicError } from "&server/routes/PublicError";
import { SessionUser } from "&server/models/SessionUser";
import * as Authentication from "&server/utils/Authentication";
import { generateMethodRoute } from "&server/routes/RouteFactory";
import * as MeetingManager from "&server/mongodb/actions/MeetingManager";
import { validateAndSanitizeIdString } from "&server/utils/Validators";
import { AuthenticationError } from "&server/utils/AuthenticationError";
import * as ApplicationManager from "&server/mongodb/actions/ApplicationManager";

import { ObjectId } from "bson";

const handler = generateMethodRoute(
  {
    requireSession: true,
  },
  {
    get: async (req) => {
      const user = req.user as SessionUser;

      if (req.query.id) {
        const objectId = validateAndSanitizeIdString(req.query.id as string);
        return validateUserHasAccessToMeeting(
          user,
          await MeetingManager.getMeetingById(objectId)
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
    put: async (req) => {
      const meeting = req.body.meeting;
      await validateUserHasAccessToMeeting(req.user as SessionUser, meeting);
      const result = await MeetingManager.addMeeting(meeting);

      if (!result) {
        throw new PublicError("Failed to insert document", 500);
      }

      return result;
    },
    delete: async (req) => {
      const id: string = req.query.id as string;
      const objectId = validateAndSanitizeIdString(id);
      const deletedDoc = await MeetingManager.cancelMeeting(objectId);

      if (!deletedDoc) {
        throw new PublicError("Could not find document", 404);
      }
      return deletedDoc;
    },
  }
);

async function validateUserHasAccessToMeeting(
  user: SessionUser,
  meeting: Record<string, any> | null
): Promise<Record<string, any> | null> {
  if (!meeting) {
    return null;
  }

  if (!user.isAdmin) {
    const applicationId = meeting.application as ObjectId;
    const application = await ApplicationManager.getApplicationById(
      applicationId
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!application.users.includes(user.id)) {
      throw new AuthenticationError(
        "User is trying to access a meeting they are not authorized to access"
      );
    }
  }
  return meeting;
}

export default handler;
