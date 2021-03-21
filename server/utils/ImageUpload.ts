import { ContainerClient } from "@azure/storage-blob";
import { SessionUser } from "&server/models/SessionUser";

const sasToken = process.env.NEXT_PUBLIC_STORAGE_SAS_TOKEN; // Fill string with your SAS token
const containerName = "image-container";
const storageAccountName =
  process.env.NEXT_PUBLIC_STORAGE_RESOURCE_NAME || "nonprofitportal"; // Fill string with your Storage resource name

/**
 * Uploads file to /image-container/{user id}/{sub directory}. If a file
 * already exists on that path, it will be overwritten
 * @param file
 * @param user
 * @param subDirectory
 */
export const uploadFileToBlob = async (
  user: SessionUser,
  subDirectory: string,
  file: File | null
): Promise<string> => {
  if (!file) return "";
  const containerClient: ContainerClient = new ContainerClient(
    `https://${storageAccountName}.blob.core.windows.net/${containerName}?${sasToken}`
  );
  return await createImageBlobInContainer(
    containerClient,
    user,
    subDirectory,
    file
  );
};

async function createImageBlobInContainer(
  containerClient: ContainerClient,
  user: SessionUser,
  subDirectory: string,
  image: File
): Promise<string> {
  const fileName = `${user.id}/${subDirectory}/${image.name}`;
  const blobClient = containerClient.getBlockBlobClient(fileName);

  const options = { blobHTTPHeaders: { blobContentType: image.type } };

  await blobClient.uploadBrowserData(image, options);

  return `https://${storageAccountName}.blob.core.windows.net/${fileName}`;
}
