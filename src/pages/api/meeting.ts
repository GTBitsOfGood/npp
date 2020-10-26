import { generateMethodRoute } from "../../../server/utils/RouteUtils";
import { validateAndSanitizeIdString } from "../../../server/utils/Validators";
import { PublicError } from "../../../server/utils/PublicError";
import MeetingManager from "../../../server/mongodb/actions/MeetingManager";

const handler = generateMethodRoute({
  get: async (req, res) => {
    if (req.query.id) {
      const objectId = validateAndSanitizeIdString(req.query.id as string);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return MeetingManager.getMeetingById(objectId);
    } else if (req.query.applicationId) {
      const objectId = validateAndSanitizeIdString(
        req.query.applicationId as string
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return MeetingManager.getMeetingByApplicationId(objectId);
    } else {
      return MeetingManager.getMeetings();
    }
  },
  put: async (req, res) => {
    const meeting = req.body.meeting;
    const result = await MeetingManager.addMeeting(meeting);

    if (!result) {
      throw new PublicError("Failed to insert document", 500);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  },
});

export default handler;
