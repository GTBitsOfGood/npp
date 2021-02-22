import { NowRequest, NowResponse } from "@vercel/node";
// do not change to path alias imports. path alias imports will not work in this context currently
import { sendEmailToService } from "../server/emails/Email";
import { TemplatedEmail } from "../server/emails/TemplatedEmail";
import { instanceOf } from "prop-types";

export default async function handler(
  req: NowRequest,
  res: NowResponse
): Promise<void> {
  // double check. we want to ensure this is configured properly
  if (!process.env.MAIL_MICROSERVICE_KEY) {
    throw new Error("No mail key set");
  }

  if (
    req.headers.authorization != `Bearer ${process.env.MAIL_MICROSERVICE_KEY}`
  ) {
    res.status(401).json({
      message: "API Key Incorrect",
    });
    return;
  }

  const { to, config }: { to: any; config: any } = req.body;

  if (!to || !(typeof to == "string")) {
    res.status(400).json({
      message: "Missing to or invalid syntax for to",
    });
    return;
  }

  if (
    !config ||
    !(config instanceof Object) ||
    !("templateName" in config) ||
    !("locals" in config) ||
    !(config.locals instanceof Object)
  ) {
    res.status(400).json({
      message: "Missing config or invalid syntax config",
    });
    return;
  }

  await sendEmailToService(
    to as string,
    config as TemplatedEmail<Record<string, any>>
  );

  res.status(201).json({
    sent: true,
  });
}
