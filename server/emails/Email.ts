import Email, { NodeMailerTransportOptions } from "email-templates";
import path from "path";
import { TemplatedEmail } from "./TemplatedEmail";
import { object } from "prop-types";

const FROM_ADDRESS = '"GT Bits of Good" <hello@bitsofgood.org>';
const BASE_TEMPLATE_PATH_LOCAL = path.join(
  (process.env.ROOT ? process.env.ROOT : "") as string,
  "/emails"
);

const TRANSPORT_CONFIG: NodeMailerTransportOptions = {
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
): Promise<void> {
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
    // in prod, all locals are serialized and send to an endpoint. the json.stringify and parse mimics this behavior
    await sendEmailToService(
      to,
      JSON.parse(JSON.stringify(emailConfigWithEnvironmentLocals)),
      BASE_TEMPLATE_PATH_LOCAL
    );
    return;
  }

  return sendEmailThroughMicroservice(emailConfigWithEnvironmentLocals, to);
}

/**
 * Calls the internal lambda (which has access to the templates) to send an email
 * @param config - the email config
 * @param to - who to send the email to
 */
async function sendEmailThroughMicroservice(
  config: TemplatedEmail<Record<string, any>>,
  to: string
): Promise<void> {
  const fetchResult = await fetch(
    `https://${process.env.VERCEL_URL}/api/email` as string,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MAIL_MICROSERVICE_KEY}`,
      },
      body: JSON.stringify({ to, config }),
    }
  );
  const jsonResult = await fetchResult.json();
  if (jsonResult == null) {
    throw new Error(
      `'Could not connect to e-mail microservice!' (status=${fetchResult.status})`
    );
  }

  if (!fetchResult.ok) {
    if (!jsonResult.message) {
      throw new Error(
        `Received an unkown bad response (status=${
          fetchResult.status
        }): ${JSON.stringify(object)}`
      );
    }
    throw new Error(
      `Received a bad response (status=${fetchResult.status}): ${jsonResult.message}`
    );
  }
  if (!jsonResult.sent) {
    throw new Error("Failed to send email");
  }
}

/**
 * (DO NOT CALL THIS FUNCTION IF YOU"RE SENDING AN EMAIL WITHIN
 * NPP). Please call sendEmail instead
 *
 * This function tells the e-mail service to send an e-mail
 * @param to - the email to send the email to
 * @param config - the email config
 * @param emailTemplateDirectoryPath - path to email template directory
 */
export function sendEmailToService<T extends Record<string, any>>(
  to: string,
  config: TemplatedEmail<Record<string, any>>,
  emailTemplateDirectoryPath: string
): Promise<any> {
  const templateFolder = path.join(
    emailTemplateDirectoryPath,
    `/templates/${config.templateName}`
  );
  const email = new Email({
    message: {
      from: FROM_ADDRESS,
    },
    transport: TRANSPORT_CONFIG,
    // Only send emails in dev if mail_host is set, this prevents error being thrown in testing
    send: process.env.MAIL_HOST != null,
    juice: true,
    juiceResources: {
      preserveImportant: true,
      webResources: {
        relativeTo: emailTemplateDirectoryPath + "/",
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
