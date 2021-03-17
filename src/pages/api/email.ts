import { sendEmailToService } from "&server/emails/Email";
import { NextApiRequest, NextApiResponse } from "next";

const TEMPLATE_PATH = "/emails";
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

  const templateFolder = `${TEMPLATE_PATH}/${config.templateName}/`;
  const templatePromise = getFileContentFromGithub(
    REPO_PATH,
    COMMIT_ID,
    templateFolder + "html.pug"
  );
  const subjectPromise = getFileContentFromGithub(
    REPO_PATH,
    COMMIT_ID,
    templateFolder + "subject.pug"
  );

  const resourceRelativeTo = `${getBaseRepoFileSystemPath(
    REPO_PATH,
    COMMIT_ID
  )}${templateFolder}`;
  void (await Promise.all([templatePromise, subjectPromise]));

  await sendEmailToService(to, config, {
    templateBlob: (await templatePromise) as string,
    subjectBlob: (await subjectPromise) as string,
    relativeTo: resourceRelativeTo,
  });

  res.status(201).json({
    sent: true,
  });
}

async function getFileContentFromGithub(
  repoPath: string,
  commitId: string,
  path: string
): Promise<string | null> {
  const result = await fetch(
    `${getBaseRepoFileSystemPath(repoPath, commitId)}/${path}`
  );
  if (!result.ok) {
    if (result.status == 404) {
      return null;
    }
    throw new Error(
      `Received an unknown bad response when fetching from github file status=${result.status})}`
    );
  }
  return result.text();
}

function getBaseRepoFileSystemPath(repoPath: string, commitId: string) {
  return `https://raw.githubusercontent.com/${repoPath}/${commitId}`;
}
