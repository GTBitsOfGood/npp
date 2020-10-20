import { generateMethodRoute } from "../../../server/utils/RouteUtils";
import { validateAndSanitizeIdString } from "../../../server/utils/Validators";
import AvailabilityManager from "../../../server/mongodb/actions/AvailabilityManager";
import { PublicError } from "../../../server/utils/PublicError";

const handler = generateMethodRoute({
  get: async (req, res) => {
    if (req.query.id) {
      const objectId = validateAndSanitizeIdString(req.query.id as string);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return AvailabilityManager.getAvailabilityById(objectId);
    } else {
      return AvailabilityManager.getAvailabilitiesFromStartOfWeek();
    }
  },
  put: async (req, res) => {
    const availability = req.body.availability;
    const result = await AvailabilityManager.addAvailability(availability);

    if (!result) {
      throw new PublicError("Failed to insert document", 500);
    }

    return result;
  },
  post: async (req, res) => {
    const id = req.body.id;
    const fieldsToUpdate: any = req.body.updates;
    const objectId = validateAndSanitizeIdString(id);
    const updatedDoc = await AvailabilityManager.updateAvailability(
      objectId,
      fieldsToUpdate
    );

    if (!updatedDoc) {
      throw new PublicError("No document updated", 404);
    }

    return updatedDoc;
  },
  delete: async (req, res) => {
    const id: string = req.query.id as string;
    const objectId = validateAndSanitizeIdString(id);
    const deletedDoc = await AvailabilityManager.deleteAvailability(objectId);

    if (!deletedDoc) {
      throw new PublicError("Could not find document", 404);
    }
    return deletedDoc;
  },
});
export default handler;
