import { PublicError } from "&server/routes/PublicError";
import { SessionUser } from "&server/models/SessionUser";
import * as Authentication from "&server/utils/Authentication";
import { generateMethodRoute } from "&server/routes/RouteFactory";
import * as ApplicationManager from "&server/mongodb/actions/ApplicationManager";
import * as MeetingManager from "&server/mongodb/actions/MeetingManager";
import { validateAndSanitizeIdString } from "&server/utils/Validators";
import { AuthenticationError } from "&server/utils/AuthenticationError";

import { ObjectId } from "bson";
import AccessToken, { VideoGrant } from "twilio/lib/jwt/AccessToken";
import { DateTime } from "luxon";
import { MeetingWithAvailability } from "&server/models/Meeting";

const MAX_ALLOWED_TWILIO_SESSION_DURATION_HOURS = 2;
const MAX_HOURS_BEFORE_MEETING = 1;

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
    post: {
      routeHandler: async (req, res) => {
        const roomName: string = req.body.roomName;
        const name: string | null = req.body.name;

        const meeting = await MeetingManager.getMeetingWithAvailabilityByMeetingName(
          roomName
        );
        if (!meeting) {
          throw new PublicError("Meeting does not exist", 404);
        }
        const [
          earliestJoinTime,
          latestJoinTime,
        ] = getEarliestAndLatestJoinTimesForMeeting(meeting);

        if (earliestJoinTime > DateTime.local()) {
          throw new PublicError(
            `Can't start a meeting before ${earliestJoinTime.toLocaleString(
              DateTime.DATETIME_FULL
            )}`,
            403
          );
        }

        const tokenTTL = Math.floor(latestJoinTime.diffNow().as("seconds"));
        if (tokenTTL <= 0) {
          throw new PublicError(
            `You can't join a meeting after ${latestJoinTime.toLocaleString(
              DateTime.DATETIME_FULL
            )}`,
            403
          );
        }
        console.log("A");
        // Shoehorning in the validity check endpoint
        if (req.query.checkValid) {
          return { valid: true };
        }

        const token = new AccessToken(
          process.env.TWILIO_ACCOUNT_SID as string,
          process.env.API_KEY_SID as string,
          process.env.API_KEY_SECRET as string,
          {
            ttl: tokenTTL,
          }
        );
        token.identity = name as string;
        const videoGrant = new VideoGrant({
          room: roomName,
        });
        token.addGrant(videoGrant);
        return {
          token: token.toJwt(),
        };
      },
      routeConfiguration: {
        requireSession: false,
      },
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
  },
  {
    cors: {
      methods: ["POST"],
      origin: [/http:\/\/localhost:\d*/, "https://bog-video.netlify.app/"],
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

function getEarliestAndLatestJoinTimesForMeeting(
  meeting: MeetingWithAvailability
): [DateTime, DateTime] {
  return [
    meeting.availability.startDatetime.minus({
      hours: MAX_HOURS_BEFORE_MEETING,
    }),
    meeting.availability.startDatetime.plus({
      hours: MAX_ALLOWED_TWILIO_SESSION_DURATION_HOURS,
    }),
  ];
}

export default handler;
