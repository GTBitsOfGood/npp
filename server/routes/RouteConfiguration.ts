import { NextApiResponse } from "next";
import { HttpResponse } from "../models/HttpResponse";
import { NppApiRequest } from "./NppApiRequest";

export type RouteHandler = (
  req: NppApiRequest,
  res: NextApiResponse
) => Promise<HttpResponse | any>;

export interface RouteConfiguration {
  requireSession?: boolean;
  requiredRoles?: string[];
  // when session not required, but fetch when it's there
  fetchSessionWhenPossible?: boolean;
}

export interface Route {
  routeHandler: RouteHandler;
  routeConfiguration: RouteConfiguration;
}
