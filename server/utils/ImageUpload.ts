import {
  BlobServiceClient,
  BlockBlobUploadOptions,
  ContainerClient,
} from "@azure/storage-blob";
import { TransferProgressEvent } from "@azure/core-http";

const sasToken = process.env.NEXT_PUBLIC_STORAGE_SAS_TOKEN; // Fill string with your SAS token
const containerName = "image-container";
const storageAccountName =
  process.env.NEXT_PUBLIC_STORAGE_RESOURCE_NAME || "nonprofitportal"; // Fill string with your Storage resource name

export const uploadFileToBlob = async (
  file: File | null,
  onProgress?: (progressPercent: number) => void
): Promise<string> => {
  if (!file) return "";

  const containerClient: ContainerClient = new ContainerClient(
    `https://${storageAccountName}.blob.core.windows.net/${containerName}?${sasToken}`
  );
  return await createBlobInContainer(containerClient, file, onProgress);
};

const createBlobInContainer = async (
  containerClient: ContainerClient,
  image: File,
  onProgress?: (progressPercent: number) => void
) => {
  const blobClient = containerClient.getBlockBlobClient(image.name);

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

  return `https://${storageAccountName}.blob.core.windows.net/${containerName}/${image.name}`;
};
