import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";

export type RouteHandler = (req: NextApiRequest, res: NextApiResponse) => void;

export interface MethodHandlers {
  get?: RouteHandler;
  post?: RouteHandler;
  put?: RouteHandler;
  delete?: RouteHandler;
}

/**
 * Standardizes the response for an invalid method.
 * It will also wrap all requests in a "catch all" statement for internal errors.
 * These errors will be logged and assigned an object id. Unsafe to send error message
 * to user (might contain sensitive information)
 * @param methodHandlers
 */
export function generateMethodRoute(
  methodHandlers: MethodHandlers
): RouteHandler {
  const handlers: {
    [method: string]: RouteHandler | undefined;
  } = methodHandlers as { [method: string]: RouteHandler | undefined };

  return (req: NextApiRequest, res: NextApiResponse) => {
    if (!(req != null && (req.method as string) in methodHandlers)) {
      res.status(501).json({
        message: "Unsupported operation",
      });
    }
    callRouteHandlerAndCatchErrors(
      handlers[req.method as string] as RouteHandler,
      req,
      res
    );
  };
}

function callRouteHandlerAndCatchErrors(
  routeHandler: RouteHandler,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    routeHandler(req, res);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const errorUUID: string = uuidv4();
    console.log(`Internal error occurred (uuid=${errorUUID}: `, error);
    res.status(500).json({
      message: "An error occurred. Check server logs",
      errorUUID,
    });
  }
}
