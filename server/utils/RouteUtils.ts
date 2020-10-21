import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import {
  getDefaultStatusCodeForMethod,
  HttpMethod,
} from "../models/HttpMethod";
import { PublicError } from "./PublicError";
import { HttpResponse } from "../models/HttpResponse";
import { Route, RouteConfiguration, RouteHandler } from "./RouteConfiguration";
import Authentication from "./Authentication";
import { NppApiRequest } from "./NppApiRequest";

/**
 * @link ../models/HttpMethod for valid methods
 */
export type MethodRoutes = {
  [httpMethod in HttpMethod]?: Route | RouteHandler;
};

/**
 * Standardizes the response for an invalid method.
 * It will also wrap all requests in a "catch all" statement for internal errors
 * and handle known errors, such as ValidationErrors
 * Unknown errors will be logged and assigned an object id because
 * it is unnsafe to send raw error messages (could contain sensitive information)
 * @param defaultRouteConfiguration - The default route configuration for each method route
 * @param methodRoutes - The handlers for each HTTP method
 */
export function generateMethodRoute(
  defaultRouteConfiguration: RouteConfiguration,
  methodRoutes: MethodRoutes
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method
      ? HttpMethod[req.method.toUpperCase() as keyof typeof HttpMethod]
      : null;
    if (method == null || !(method in methodRoutes)) {
      res.status(501).json({
        message: `Unsupported operation: ${method ?? "No method defined"}`,
        success: false,
      });
      return;
    }
    const originalRoute = getRoute(methodRoutes, method);
    const route = {
      routeHandler: originalRoute.routeHandler,
      routeConfiguration: {
        ...defaultRouteConfiguration,
        ...originalRoute.routeConfiguration,
      },
    };

    await callRouteHandlerAndCatchErrors(route, method, req, res);
  };
}

function getRoute(methodRoutes: MethodRoutes, method: HttpMethod): Route {
  const routeOrRouteHandler: Route | RouteHandler = methodRoutes[
    method
  ] as Route;
  if (typeof routeOrRouteHandler !== "function") {
    return routeOrRouteHandler;
  }

  return {
    routeHandler: routeOrRouteHandler,
    routeConfiguration: {},
  };
}

/**
 * Generates a route for all HTTP Methods
 * @param route
 */
export function generateAnyMethodRoute(
  route: Route
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    return callRouteHandlerAndCatchErrors(route, HttpMethod.POST, req, res);
  };
}

async function callRouteHandlerAndCatchErrors(
  route: Route,
  method: HttpMethod,
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { routeHandler, routeConfiguration } = route;
    const {
      requireSession,
      requiredRoles,
      fetchSessionWhenPossible,
    } = routeConfiguration;

    const nppReq = req as NppApiRequest;

    if (fetchSessionWhenPossible || requireSession) {
      const user = await Authentication.getUser(req);
      nppReq.user = user;

      if (requireSession) {
        await Authentication.authenticate(user, requiredRoles);
      }
    }
    handleSuccessfulResponse(await routeHandler(nppReq, res), method, res);
  } catch (error) {
    handleError(error, res);
  }
}

function handleSuccessfulResponse(
  response: HttpResponse | any,
  method: HttpMethod,
  res: NextApiResponse
) {
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
}

function handleError(error: unknown, res: NextApiResponse) {
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
