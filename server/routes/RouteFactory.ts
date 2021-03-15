import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import {
  getDefaultStatusCodeForMethod,
  HttpMethod,
} from "../models/HttpMethod";
import { PublicError } from "./PublicError";
import { HttpResponse } from "../models/HttpResponse";
import { Route, RouteConfiguration, RouteHandler } from "./RouteConfiguration";
import * as Authentication from "../utils/Authentication";
import { NppApiRequest } from "./NppApiRequest";
import { MetricReporter } from "&server/utils/MetricReporter";
import Cors, { CorsOptions } from "cors";

import { runMiddleware } from "&server/utils/RouteUtils";

/**
 * @link ../models/HttpMethod for valid methods
 */
export type MethodRoutes = {
  [httpMethod in HttpMethod]?: Route | RouteHandler;
};

const METRIC_REPORTER = new MetricReporter();
const EVENTS = {
  REQUEST: "REQUEST",
  AUTH_FETCH: "AUTH_FETCH",
};

/**
 * Standardizes the response for an invalid method.
 * It will also wrap all requests in a "catch all" statement for internal errors
 * and handle known errors, such as Validation and Authentication errors.
 * Unknown errors will be logged and assigned an object id because
 * it is unnsafe to send raw error messages (could contain sensitive information)
 *
 * @param defaultRouteConfiguration - The default route configuration for each method route
 * @param methodRoutes - The handlers for each HTTP method
 * @param endpointConfiguration - Configures across all routes. CORS for instance needs acceess to both the desired METHOD and Options
 */
export function generateMethodRoute(
  defaultRouteConfiguration: RouteConfiguration,
  methodRoutes: MethodRoutes,
  endpointConfiguration: {
    cors?: CorsOptions;
  } = {}
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  const parsedRoutes: {
    [httpMethod in HttpMethod]?: Route;
  } = preParseRouteConfigurations(defaultRouteConfiguration, methodRoutes);

  const cors = endpointConfiguration.cors
    ? Cors(endpointConfiguration.cors)
    : null;

  return async (req: NextApiRequest, res: NextApiResponse) => {
    const nppReq = req as NppApiRequest;
    nppReq.startTime = new Date();
    METRIC_REPORTER.reportIntervalEventInitiated(
      getEventSourcePrefixForReq(nppReq),
      EVENTS.REQUEST,
      nppReq.startTime
    );

    if (cors) {
      await runMiddleware(cors, req, res);
    }

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

    await callRouteHandlerAndCatchErrors(
      parsedRoutes[method] as Route,
      method,
      nppReq,
      res
    );
    nppReq.endTime = new Date();
    METRIC_REPORTER.reportIntervalEventCompleted(
      getEventSourcePrefixForReq(nppReq),
      EVENTS.REQUEST,
      nppReq.startTime,
      nppReq.endTime
    );
  };
}

function preParseRouteConfigurations(
  defaultConfiguration: RouteConfiguration,
  methodRoutes: MethodRoutes
): { [httpMethod in HttpMethod]?: Route } {
  return Object.fromEntries(
    Object.entries(methodRoutes).map(([method, routeOrRouteHandler]) => [
      method,
      parseRouteUsingDefaultConfiguration(
        defaultConfiguration,
        routeOrRouteHandler as Route | RouteHandler
      ),
    ])
  );
}

function parseRouteUsingDefaultConfiguration(
  defaultConfiguration: RouteConfiguration,
  routeOrRouteHandler: Route | RouteHandler
): Route {
  const originalRoute: Route =
    typeof routeOrRouteHandler == "function"
      ? { routeHandler: routeOrRouteHandler, routeConfiguration: {} }
      : (routeOrRouteHandler as Route);

  return {
    routeHandler: originalRoute.routeHandler,
    routeConfiguration: {
      ...defaultConfiguration,
      ...originalRoute.routeConfiguration,
    },
  };
}

function getEventSourcePrefixForReq(req: NppApiRequest) {
  return `[${req.method}] ${req.url}`;
}

/**
 * Generates a route for all HTTP Methods. Same as above but
 * not specific to any HTTP Method (treats PUT the same as GET the same as...)
 * @param route - The Route to wrap
 */
export function generateAnyMethodRoute(
  route: Route
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const nppReq = req as NppApiRequest;
    nppReq.startTime = new Date();
    METRIC_REPORTER.reportIntervalEventInitiated(
      getEventSourcePrefixForReq(nppReq),
      EVENTS.REQUEST,
      nppReq.startTime
    );
    await callRouteHandlerAndCatchErrors(route, HttpMethod.POST, nppReq, res);
    nppReq.endTime = new Date();
    METRIC_REPORTER.reportIntervalEventCompleted(
      getEventSourcePrefixForReq(nppReq),
      EVENTS.REQUEST,
      nppReq.endTime
    );
  };
}

async function callRouteHandlerAndCatchErrors(
  route: Route,
  method: HttpMethod,
  req: NppApiRequest,
  res: NextApiResponse
) {
  try {
    const { routeHandler, routeConfiguration } = route;
    const {
      requireSession,
      requiredRoles,
      fetchSessionWhenPossible,
    } = routeConfiguration;

    if (fetchSessionWhenPossible || requireSession) {
      const startTime = new Date();
      METRIC_REPORTER.reportIntervalEventInitiated(
        getEventSourcePrefixForReq(req),
        EVENTS.AUTH_FETCH,
        startTime
      );

      const user = await Authentication.getUser(req);
      req.user = user;

      METRIC_REPORTER.reportIntervalEventCompleted(
        getEventSourcePrefixForReq(req),
        EVENTS.AUTH_FETCH,
        startTime
      );

      if (requireSession) {
        await Authentication.ensureRoles(user, requiredRoles);
      }
    }
    handleSuccessfulResponse(await routeHandler(req, res), method, res);
  } catch (error) {
    handleError(req, error, res);
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

function handleError(req: NppApiRequest, error: unknown, res: NextApiResponse) {
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
