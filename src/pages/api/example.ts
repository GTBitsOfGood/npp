import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { exampleAction } from "&server/example/actions/example";

// @route   POST api/example
// @desc    Example API
// @access  Public
const handler: NextApiHandler = (_req: NextApiRequest, res: NextApiResponse) =>
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

export default handler;
