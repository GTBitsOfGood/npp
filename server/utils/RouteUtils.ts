import { NextApiRequest, NextApiResponse } from "next";

export function runMiddleware<T>(
  middleware: (
    req: NextApiRequest,
    res: NextApiResponse,
    callback: (result: T) => void
  ) => void,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    middleware(req, res, (result) => {
      if (result instanceof Error) {
        reject(result);
      }
      resolve(result as T);
    });
  });
}
