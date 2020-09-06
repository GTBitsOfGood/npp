import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { exampleAction } from "../../../server/example/actions/example";

// @route   POST api/example
// @desc    Example API
// @access  Public
const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) =>
  exampleAction()
    .then((text) =>
      res.status(201).json({
        success: true,
        payload: text,
      })
    )
    .catch(() =>
      res.status(500).json({
        success: false,
        message: "Failed to run action!",
      })
    );

export default handler;
