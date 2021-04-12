import { TemplatedEmail } from "./TemplatedEmail";

const EMAIL_MICROSERVICE_BASE =
  process.env.NODE_ENV == "development"
    ? "http://localhost:3000"
    : `https://${process.env.VERCEL_URL}`;

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
    `${EMAIL_MICROSERVICE_BASE}/api/email` as string,
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
        }): ${JSON.stringify(jsonResult)}`
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
