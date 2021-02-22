import Email, { NodeMailerTransportOptions } from "email-templates";
import path from "path";
import { TemplatedEmail } from "./TemplatedEmail";

const FROM_ADDRESS = '"GT Bits of Good" <hello@bitsofgood.org>';
console.log("TEST:" + process.env.ROOT);
const baseTemplatePath = path.join(process.env.ROOT as string, "/emails");

const transportConfig: NodeMailerTransportOptions = {
  service: "Zoho",
  host: process.env.MAIL_HOST as string,
  port: parseInt(process.env.MAIL_PORT as string),
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
};

export async function sendEmail<T extends Record<string, any>>(
  to: string,
  config: TemplatedEmail<T>
): Promise<boolean> {
  const emailConfigWithEnvironmentLocals: TemplatedEmail<Record<
    string,
    any
  >> = {
    templateName: config.templateName,
    locals: {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      ...config.locals,
    },
  };
  if (process.env.NODE_ENV == "development") {
    await sendEmailToService(to, emailConfigWithEnvironmentLocals);
    return true;
  }

  return sendEmailThroughMicroservice(emailConfigWithEnvironmentLocals, to);
}

async function sendEmailThroughMicroservice(
  config: TemplatedEmail<Record<string, any>>,
  to: string
): Promise<boolean> {
  const fetchResult = await fetch(process.env.MAIL_MICROSERVICE_URL as string, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MAIL_MICROSERVICE_KEY}`,
    },
    body: JSON.stringify({ to, config }),
  });
  const jsonResult = await fetchResult.json();
  if (jsonResult == null) {
    throw new Error(
      `'Could not connect to e-mail microservice!' (status=${fetchResult.status})`
    );
  }

  if (!fetchResult.ok) {
    throw new Error(
      `Received a bad response (status=${fetchResult.status}): ${jsonResult}`
    );
  }

  return jsonResult;
}

/**
 * (DO NOT CALL THIS FUNCTION IF YOU"RE SENDING AN EMAIL WITHIN
 * NPP). Please call (sendEmail) instead
 * This function tells are e-mail service to send an e-mail
 * @param to - the email to send the email to
 * @param config - the email config
 */
export function sendEmailToService<T extends Record<string, any>>(
  to: string,
  config: TemplatedEmail<Record<string, any>>
): Promise<any> {
  const templateFolder = path.join(baseTemplatePath, config.templateName);
  const email = new Email({
    message: {
      from: FROM_ADDRESS,
    },
    transport: transportConfig,
    // Only send emails in dev if mail_host is set, this prevents error being thrown in testing
    send: process.env.MAIL_HOST != null,
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: templateFolder,
      },
    },
  });

  return email.send({
    template: templateFolder,
    message: {
      to: to,
    },
    locals: config.locals,
  });
}
