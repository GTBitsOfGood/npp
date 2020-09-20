import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { exampleAction } from "../../../server/example/actions/example";
import { getSession } from "next-auth/client";

// @route   POST api/example
// @desc    Example API
// @access  Public
const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({ req });
  exampleAction()
    .then((payload) =>
      res.status(200).json({
        success: true,
        payload,
      })
    )
    .catch(() =>
      res.status(500).json({
        success: false,
        message: "Failed to run action!",
      })
    );
};
export default handler;
