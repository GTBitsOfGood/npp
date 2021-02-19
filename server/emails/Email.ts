import Email, { NodeMailerTransportOptions } from "email-templates";
import path from "path";
import { TemplatedEmail } from "./TemplatedEmail";

const fromAddress = '"GT Bits of Good" <hello@bitsofgood.org>';
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

export function sendEmail<T extends Record<string, any>>(
  to: string,
  config: TemplatedEmail<T>
): Promise<any> {
  const templateFolder = path.join(baseTemplatePath, config.templateName);
  const email = new Email({
    message: {
      from: fromAddress,
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
    locals: {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
      ...config.locals,
    },
  });
}
