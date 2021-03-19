import { sendEmailToService } from "&server/emails/Email";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as fs from "fs";

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

  await downloadTemplateAssets(config.templateName);
  await sendEmailToService(to, config, EMAIL_CACHE_LOCATION);

  res.status(201).json({
    sent: true,
  });
}

async function downloadTemplateAssets(template: string) {
  const downloadPromises = [
    downloadIfNotInCache(
      REPO_PATH,
      COMMIT_ID,
      path.join(EMAIL_GITHUB_ROOT, `/${template}`),
      `${template}`
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
