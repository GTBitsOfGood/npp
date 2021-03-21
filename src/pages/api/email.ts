import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as fs from "fs";
import { TemplatedEmail } from "&server/emails/TemplatedEmail";
import Email, { NodeMailerTransportOptions } from "email-templates";

// email config options
const FROM_ADDRESS = '"GT Bits of Good" <hello@bitsofgood.org>';
const TRANSPORT_CONFIG: NodeMailerTransportOptions = {
  service: "Zoho",
  auth: {
    user: process.env.MAIL_USER as string,
    pass: process.env.MAIL_PASS as string,
  },
};

// for downloading in vercel
const BASE_TEMPLATE_PATH_LOCAL = path.join(
  (process.env.ROOT ? process.env.ROOT : "") as string,
  "/emails"
);
const EMAIL_CACHE_LOCATION = `/tmp/emails`;
const EMAIL_GITHUB_ROOT = `/emails`;
const REPO_PATH = `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`;
const COMMIT_ID: string = process.env.VERCEL_GIT_COMMIT_SHA as string;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
  let emailTemplateDirectory: string;
  if (process.env.NODE_ENV == "development") {
    emailTemplateDirectory = BASE_TEMPLATE_PATH_LOCAL;
  } else {
    emailTemplateDirectory = EMAIL_CACHE_LOCATION;
    await downloadTemplateAssets(config.templateName);
  }

  await sendEmailToService(to, config, emailTemplateDirectory);
  res.status(201).json({
    sent: true,
  });
}

async function downloadTemplateAssets(template: string) {
  const downloadPromises = [
    downloadIfNotInCache(
      REPO_PATH,
      COMMIT_ID,
      path.join(EMAIL_GITHUB_ROOT, `/templates/${template}`),
      `/templates/${template}`
    ),
    downloadIfNotInCache(
      REPO_PATH,
      COMMIT_ID,
      path.join(EMAIL_GITHUB_ROOT, "/assets"),
      "/assets"
    ),
  ];
  await Promise.all(downloadPromises);
}

async function downloadIfNotInCache(
  repoPath: string,
  commitId: string,
  pathInGithub: string,
  pathInCache: string
): Promise<void> {
  const absolutePathInCache = path.join(EMAIL_CACHE_LOCATION, pathInCache);
  if (!fs.existsSync(absolutePathInCache)) {
    return downloadDirectoryFromGithub(
      repoPath,
      commitId,
      pathInGithub,
      absolutePathInCache
    );
  }
}

export interface GithubFileMetadata {
  name: string;
  download_url: string | null;
  type: string;
  path: string;
}

/**
 *
 * @param repoPath - path to the repo
 * @param commitId - commit id of the repo
 * @param directoryPath - path in github directory
 * @param targetPath - path to save the folder to
 */
async function downloadDirectoryFromGithub(
  repoPath: string,
  commitId: string,
  directoryPath: string,
  targetPath: string
): Promise<void> {
  fs.mkdirSync(targetPath, { recursive: true });

  const result = await fetch(
    `https://api.github.com/repos/${repoPath}/contents/${directoryPath}?ref=${commitId}`
  );

  if (!result.ok) {
    throw new Error(
      `Received an unknown bad response when fetching from github file status=${result.status})}`
    );
  }

  const writeFilePromises = ((await result.json()) as GithubFileMetadata[]).map(
    async (file) => {
      if (file.type != "file") {
        throw new Error(
          `Encountered a file object that was not a file; this is currently not supported (type=${file.type}, name=${file.name})`
        );
      }
      fs.writeFileSync(
        path.join(targetPath, file.name),
        await (await fetch(file.download_url as string)).text()
      );
    }
  );
  await Promise.all(writeFilePromises);
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
    // Only send emails in dev if mail_user is set, this prevents error being thrown in testing
    send: process.env.MAIL_USER,
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
