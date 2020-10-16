import { generateMethodRoute } from "../../../server/utils/RouteUtils";
import { validateAndSanitizeIdString } from "../../../server/utils/Validators";
import AvailabilityManager from "../../../server/mongodb/actions/AvailabilityManager";
import { PublicError } from "../../../server/utils/PublicError";

const handler = generateMethodRoute({
  get: async (req, res) => {
    if (req.query.id) {
      const objectId = validateAndSanitizeIdString(req.query.id as string);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const availability = await AvailabilityManager.getAvailability(objectId);

      res.status(200).json({
        payload: availability,
        success: true,
      });
    } else {
      const availabilities = await AvailabilityManager.getAvailabilitiesFromStartOfWeek();
      res.status(200).json({
        payload: availabilities,
        success: true,
      });
    }
  },
  put: async (req, res) => {
    const availability = req.body.availability;
    const result = await AvailabilityManager.addAvailability(availability);
    if (!result) {
      throw new PublicError("Failed to insert document", 500);
    }

    res.status(201).json({
      payload: result,
      success: true,
    });
  },
  post: async (req, res) => {
    const id = req.body.id;
    const fieldsToUpdate: any = req.body.updates;
    const objectId = validateAndSanitizeIdString(id);
    if (!objectId) {
      return;
    }
    const updatedDoc = await AvailabilityManager.updateAvailability(
      objectId,
      fieldsToUpdate
    );
    res.status(200).json({
      payload: updatedDoc,
      success: true,
    });
  },
  delete: async (req, res) => {
    const id: string = req.query.id as string;
    const objectId = validateAndSanitizeIdString(id);
    const deletedDoc = await AvailabilityManager.deleteAvailability(objectId);
    if (!deletedDoc) {
      throw new PublicError("Could not find document", 410);
    }
    res.status(200).json({
      payload: deletedDoc,
      success: true,
    });
  },
});
export default handler;
