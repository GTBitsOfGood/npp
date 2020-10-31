import { generateMethodRoute } from "&server/routes/RouteFactory";
import { validateAndSanitizeIdString } from "&server/utils/Validators";
import UserManager from "&server/mongodb/actions/UserManager";

const handler = generateMethodRoute(
  {
    requireSession: true,
  },
  {
    get: async (req, _res) => {
      if (req.query.id) {
        const objectId = validateAndSanitizeIdString(req.query.id as string);
        return UserManager.getUserById(objectId);
      } else if (req.query.email) {
        return UserManager.getUserByEmail(req.query.email as string);
      }
    },
  }
);
export default handler;
