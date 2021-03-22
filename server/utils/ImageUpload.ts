import { v4 as uuidv4 } from "uuid";
import { BlockBlobUploadOptions, ContainerClient } from "@azure/storage-blob";
import { TransferProgressEvent } from "@azure/core-http";
import { SessionUser } from "&server/models/SessionUser";

const sasToken = process.env.NEXT_PUBLIC_STORAGE_SAS_TOKEN; // Fill string with your SAS token
const containerName = "image-container";
const storageAccountName =
  process.env.NEXT_PUBLIC_STORAGE_RESOURCE_NAME || "nonprofitportal"; // Fill string with your Storage resource name

/**
 * Uploads file to /image-container/{user id}/{file name}-{a unique string of characters}
 * @param file
 * @param user
 * @param onProgress
 */
export const uploadUserFileToBlob = async (
  file: File | null,
  user: SessionUser,
  onProgress?: (progressPercent: number) => void
): Promise<UploadedFile | null> => {
  if (!file) return null;
  const containerClient: ContainerClient = new ContainerClient(
    `https://${storageAccountName}.blob.core.windows.net/${containerName}?${sasToken}`
  );
  return await createImageBlobInContainerForUser(
    containerClient,
    file,
    user,
    onProgress
  );
};

async function createImageBlobInContainerForUser(
  containerClient: ContainerClient,
  image: File,
  user: SessionUser,
  onProgress?: (progressPercent: number) => void
): Promise<UploadedFile> {
  const fileName = `${user.id}/${image.name}-${uuidv4()}`;
  const blobClient = containerClient.getBlockBlobClient(fileName);

  const options: BlockBlobUploadOptions = {
    blobHTTPHeaders: {
      blobContentType: image.type,
    },
  };
  if (onProgress) {
    options.onProgress = (progress: TransferProgressEvent) =>
      onProgress(progress.loadedBytes / image.size);
  }

  await blobClient.uploadBrowserData(image, options);

  return {
    name: image.name,
    blobName: fileName,
    displayUrl: `https://${storageAccountName}.blob.core.windows.net/${fileName}`,
  };
}

export interface UploadedFile {
  name: string;
  blobName: string;
  displayUrl: string;
}
