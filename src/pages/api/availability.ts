import { generateMethodRoute } from "../../../server/utils/route-utils";
import {
  addAvailability,
  deleteAvailability,
  getAvailabilitiesFromStartOfWeek,
  getAvailability,
  updateAvailability,
} from "../../../server/mongodb/AvailabilityManager";
import { validateAndSanitizeIdString } from "../../../server/utils/validators";

const handler = generateMethodRoute({
  get: async (req, res) => {
    if (req.query.id) {
      const objectId = validateAndSanitizeIdString(req.query.id as string);
      const availability = await getAvailability(objectId);

      res.status(200).json({
        availability,
        success: true,
      });
    } else {
      const availabilities = await getAvailabilitiesFromStartOfWeek();
      res.status(200).json({
        payload: availabilities,
        success: true,
      });
    }
  },
  put: async (req, res) => {
    const availability = req.body.availability;
    const result = await addAvailability(availability);
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
    const updatedDoc = await updateAvailability(objectId, fieldsToUpdate);
    res.status(200).json({
      payload: updatedDoc,
      success: true,
    });
  },
  delete: async (req, res) => {
    const id: string = req.query.id as string;
    const objectId = validateAndSanitizeIdString(id);
    const deletedDoc = await deleteAvailability(objectId);
    res.status(200).json({
      payload: deletedDoc,
      success: true,
    });
  },
});
export default handler;
