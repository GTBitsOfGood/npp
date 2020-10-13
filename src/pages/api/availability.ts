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
      const objectId = validateAndSanitizeIdString(req.query.id as string, res);
      const availabilities = await getAvailability(objectId);
      res.status(200).json({
        availabilities,
      });
    } else {
      const availabilities = await getAvailabilitiesFromStartOfWeek();
      res.status(200).json({
        availabilities,
      });
    }
  },
  put: async (req, res) => {
    const availability = req.body;
    const result = await addAvailability(availability);
    res.status(201).json({
      availability: result,
    });
  },
  post: async (req, res) => {
    const id = req.body.id;
    const fieldsToUpdate: any = req.body.fieldsToUpdate;
    const objectId = validateAndSanitizeIdString(id, res);
    const updatedDoc = await updateAvailability(objectId, fieldsToUpdate);
    res.status(200).json({
      availability: updatedDoc,
    });
  },
  delete: async (req, res) => {
    const id: string = req.body.id;
    const objectId = validateAndSanitizeIdString(id, res);
    const deletedDoc = await deleteAvailability(objectId);
    res.status(200).json({
      availability: deletedDoc,
    });
  },
});
export default handler;
