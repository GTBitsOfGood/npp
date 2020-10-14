import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { ValidationError } from "./validators";

export type RouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<never | void>;

export interface MethodHandlers {
  get?: RouteHandler;
  post?: RouteHandler;
  put?: RouteHandler;
  delete?: RouteHandler;
}

/**
 * Standardizes the response for an invalid method.
 * It will also wrap all requests in a "catch all" statement for internal errors
 * and handle known errors, such as ValidationErrors
 * Unknown errors will be logged and assigned an object id because
 * it is unnsafe to send raw error messages (could contain sensitive information)
 * @param methodHandlers - The handlers for each HTTP method
 */
export function generateMethodRoute(
  methodHandlers: MethodHandlers
): RouteHandler {
  const handlers: {
    [method: string]: RouteHandler | undefined;
  } = methodHandlers as { [method: string]: RouteHandler | undefined };

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method ? req.method.toLowerCase() : "UNDEFINED Method";
    if (!(method in methodHandlers)) {
      res.status(501).json({
        message: `Unsupported operation: ${method}`,
        success: false,
      });
      return;
    }
    await callRouteHandlerAndCatchErrors(
      handlers[method] as RouteHandler,
      req,
      res
    );
  };
}

async function callRouteHandlerAndCatchErrors(
  routeHandler: RouteHandler,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await routeHandler(req, res);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(error.statusCode).json({
        message: error.message,
        success: false,
      });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const errorUUID: string = uuidv4();
    console.log(`Internal error occurred (uuid=${errorUUID}: `, error);
    res.status(500).json({
      message: "An error occurred. Check server logs",
      success: false,
      errorUUID,
    });
  }
}
