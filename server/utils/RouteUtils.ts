import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import {
  getDefaultStatusCodeForMethod,
  HttpMethod,
} from "../models/HttpMethod";
import { PublicError } from "./PublicError";
import { HttpResponse } from "../models/HttpResponse";

export type RouteHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<HttpResponse | any>;

/**
 * @link ../models/HttpMethod for valid methods
 */
export type MethodHandlers = {
  [httpMethod in HttpMethod]?: RouteHandler;
};

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
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  const handlers: {
    [method: string]: RouteHandler | undefined;
  } = methodHandlers;

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method
      ? HttpMethod[req.method.toUpperCase() as keyof typeof HttpMethod]
      : null;
    if (method == null || !(method in methodHandlers)) {
      res.status(501).json({
        message: `Unsupported operation: ${method ?? "No method defined"}`,
        success: false,
      });
      return;
    }
    await callRouteHandlerAndCatchErrors(
      handlers[method] as RouteHandler,
      method,
      req,
      res
    );
  };
}

async function callRouteHandlerAndCatchErrors(
  routeHandler: RouteHandler,
  method: HttpMethod,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await routeHandler(req, res);
    if (response instanceof HttpResponse) {
      return res.status(response.statusCode).json({
        payload: response.payload,
        success: true,
      });
    } else {
      // infer status code from method. treat entire response as payload
      return res.status(getDefaultStatusCodeForMethod(method)).json({
        payload: response,
        success: true,
      });
    }
  } catch (error) {
    if (error instanceof PublicError) {
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
